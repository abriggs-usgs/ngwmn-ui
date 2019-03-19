import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

import { drawAxisX, drawAxisYMain, drawAxisYWellDiagramDepth, drawAxisYWellDiagramElevation, drawAxisYLabelMain,
         drawAxisYLabelWellDiagramDepth, drawAxisYLabelWellDiagramElevation } from './axes';


describe('graph component', () => {
    let svg;
    let div;

    beforeEach(() => {
        svg = select('body')
            .append('svg')
                .attr('id', 'svg-container');
        div = select('body')
            .append('div')
                .attr('id', 'div-container');
    });

    afterEach(() => {
        svg.remove();
        div.remove();
    });

    describe('drawAxisX function', () => {
        it('renders an axis', () => {
            drawAxisX(svg, {
                xScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {height: 100}
            });
            expect(svg.selectAll('.x-axis').size()).toBe(1);
        });
    });

    describe('drawAxisYMain function', () => {
        it('renders', () => {
            drawAxisYMain(svg, {
                yScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {x: 0, y: 0}
            });
            expect(svg.selectAll('.y-axis').size()).toBe(1);
        });
    });

    describe('drawAxisYWellDiagramElevation function', () => {
        it('renders', () => {
            drawAxisYWellDiagramElevation(svg, {
                yScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {x: 0, y: 0}
            });
            expect(svg.selectAll('.y-axis').size()).toBe(1);
        });
    });

    describe('drawAxisYWellDiagramDepth function', () => {
        it('renders', () => {
            drawAxisYWellDiagramDepth(svg, {
                yScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {x: 0, y: 0}
            });
            expect(svg.selectAll('.y-axis').size()).toBe(1);
        });
    });


    describe('drawAxisYLabelMain function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabelMain(div, {});
            expect(label.text()).toEqual('Depth to water');
            label = drawAxisYLabelMain(div, {unit: 'feet'}, label);
            expect(label.text()).toEqual('Depth to water, feet below land surface');
        });
    });

    describe('drawAxisYLabelWellDiagramDepth function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabelWellDiagramDepth(div, {});
            expect(label.text()).toEqual('Depth below land surface');
            label = drawAxisYLabelWellDiagramDepth(div, {unit: 'feet'}, label);
            expect(label.text()).toEqual('Depth below land surface in feet');
        });
    });

    describe('drawAxisYLabelWellDiagramElevation function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabelWellDiagramElevation(div, {});
            let wellLog =
                    {
                        'elevation': {
                            'scheme': 'NAVD88',
                            'unit': 'ft',
                            'value': 1000
                        }
                    };
            expect(label.text()).toEqual('Elevation');
            label = drawAxisYLabelWellDiagramElevation(div, {unit: 'feet', wellLog: wellLog}, label);
            expect(label.text()).toEqual('Elevation(NAVD88) in feet');
        });
    });

});
