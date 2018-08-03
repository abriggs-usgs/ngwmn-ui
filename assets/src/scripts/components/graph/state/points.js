import { extent } from 'd3-array';
import { createSelector } from 'reselect';

import { getWaterLevels } from 'ngwmn/services/state/index';

import { getCurrentWaterLevelID } from './options';


// Lines will be split if the difference exceeds two years.
export const MAX_LINE_POINT_GAP = 1000 * 60 * 60 * 24 * 365 * 2;

// 20% padding around the y-domain
const PADDING_RATIO = 0.2;


export const getCurrentWaterLevels = createSelector(
    getWaterLevels,
    getCurrentWaterLevelID,
    (waterLevels, waterLevelID) => {
        return waterLevels[waterLevelID] || {};
    }
);

export const getCurrentWaterLevelUnit = createSelector(
    getCurrentWaterLevels,
    (waterLevels) => {
        if (waterLevels.samples && waterLevels.samples.length) {
            return waterLevels.samples[0].unit;
        } else {
            return null;
        }
    }
);

/**
 * Selector to return points visible on the current chart view.
 * @type {Array} List of visible points
 */
export const getChartPoints = createSelector(
    getCurrentWaterLevels,
    (waterLevels) => {
        const samples = waterLevels.samples || [];
        return samples.map(datum => {
            return {
                dateTime: datum.time,
                value: parseFloat(datum.fromDatumValue),
                approved: datum.comment === 'A'  // provisional = 'P'
            };
        }).sort((a, b) => {
            return a.dateTime.getTime() - b.dateTime.getTime();
        });
    }
);

export const getDomainX = createSelector(
    getChartPoints,
    (chartPoints) => {
        return extent(chartPoints, pt => pt.dateTime);
    }
);

export const getDomainY = createSelector(
    getChartPoints,
    (chartPoints) => {
        const values = chartPoints.map(pt => pt.value);
        let domain = [
            Math.min(...values),
            Math.max(...values)
        ];
        const isPositive = domain[0] >= 0 && domain[1] >= 0;

        // Pad domains on both ends by PADDING_RATIO.
        const padding = PADDING_RATIO * (domain[1] - domain[0]);
        domain = [
            domain[0] - padding,
            domain[1] + padding
        ];

        // For positive domains, a zero-lower bound on the y-axis is enforced.
        return [
            isPositive ? Math.max(0, domain[0]) : domain[0],
            domain[1]
        ];
    }
);

/**
 * Returns all points in the current time series split into line segments.
 * @param  {Object} state     Redux store
 * @return {Array} List of lines segments
 */
export const getLineSegments = createSelector(
    getChartPoints,
    (points) => {
        let lines = [];

        // Accumulate data into line groups, splitting on the estimated and
        // approval status.
        let lastClasses = {};

        for (let pt of points) {
            // Classes to put on the line with this point.
            let lineClasses = {
                approved: pt.approved,
                provisional: !pt.approved
            };

            // Split lines if the gap from the period point exceeds
            // MAX_LINE_POINT_GAP.
            let splitOnGap = false;
            if (lines.length > 0) {
                const lastPoints = lines[lines.length - 1].points;
                const lastPtDateTime = lastPoints[lastPoints.length - 1].dateTime;
                if (pt.dateTime - lastPtDateTime > MAX_LINE_POINT_GAP) {
                    splitOnGap = true;
                }
            }

            // If this point doesn't have the same classes as the last point,
            // create a new line for it.
            if (lastClasses.approved !== lineClasses.approved ||
                lastClasses.provisional !== lineClasses.provisional ||
                splitOnGap) {
                lines.push({
                    classes: lineClasses,
                    points: []
                });
            }

            // Add this point to the current line.
            lines[lines.length - 1].points.push(pt);

            // Cache the classes for the next loop iteration.
            lastClasses = lineClasses;
        }
        return lines;
    }
);