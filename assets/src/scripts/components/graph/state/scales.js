import { scaleLinear } from 'd3-scale';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

import {getChartPositionMain, getChartPositionWellDiagram} from './layout';
import { getDomainX, getDomainY } from './points';
import { getCurrentWellLog } from '../state/well-log';


/**
 * Selector for x-scale
 * @param  {Object} state       Redux store
 * @return {Function}           D3 scale function
 */
export const getScaleX = memoize((opts, chartType) => createSelector(
    getDomainX(opts, chartType),
    getChartPositionMain(opts, chartType),
    (domainX, size) => {
        return scaleLinear()
            .domain(domainX)
            .range([size.x, size.x + size.width]);
    }
));

/**
 * Selector for y-scale
 * @param  {Object} state   Redux store
 * @return {Function}       D3 scale function
 */
export const getScaleYMain = memoize((opts, chartType) => createSelector(
    getDomainY(opts, chartType),
    getChartPositionMain(opts, chartType),
    (domainY, size) => {
        return scaleLinear()
            .domain(domainY)
            .range([size.y, size.y + size.height]);
    }
));

export const getScaleYWellDiagram = memoize((opts, chartType) => createSelector(
    getDomainY(opts, chartType),
    getChartPositionWellDiagram(opts, chartType),
    (domainY, size) => {
        return scaleLinear()
            .domain(domainY)
            .range([size.y, size.y + size.height]);
    }
));

/**
 * Selector for y-scale for elevation
 * @param  {Object} opts        Detailed specifications to identify a specific monitoring location
 * @param {Object} chartType    Identifies for which chart type the functions are called
 * @return {Function}           D3 scale function containing the domain and range of the axis
 */
export const getScaleYElevation = memoize((opts, chartType) => createSelector(
    getDomainY(opts, chartType),
    getChartPositionMain(opts, chartType),
    getCurrentWellLog(opts),
    (domainY, size, wellLog) => {
        return scaleLinear()
            .domain([wellLog['elevation']['value'], wellLog['elevation']['value'] - domainY[1]])
            .range([size.y, size.y + size.height]);
    }
));
