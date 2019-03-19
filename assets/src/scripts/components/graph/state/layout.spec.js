import { combineReducers, createStore } from 'redux';

import getMockStore from 'ngwmn/store.mock';

import reducer from './layout';
import { getAxisYMainBBox, getChartPositionMain, getContainerSizeMain, getViewBoxMain,
         getViewport, resetViewport, setAxisYMainBBox, setContainerSizeMain,
         setViewport } from './layout';


describe('graph component layout state', () => {
    const mockOpts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };
    let store;

    beforeEach(() => {
        store = createStore(combineReducers(reducer), {});
    });

    it('setContainerSizeMain works', () => {
        store.dispatch(setContainerSizeMain(mockOpts.id, {width: 10, height: 20}));
        expect(getContainerSizeMain(mockOpts)(store.getState())).toEqual({width: 10, height: 20});
    });

    it('setViewport and resetViewport works with mock store', () => {
        store = getMockStore();
        const domain = [
            new Date('2010-10-10'),
            new Date('2012-10-10')
        ];
        store.dispatch(setViewport(mockOpts.id, domain));
        expect(getViewport(mockOpts)(store.getState())).toEqual(domain);
        store.dispatch(resetViewport(mockOpts.id));
        expect(getViewport(mockOpts)(store.getState())).not.toEqual(null);
    });

    it('getChartPositionMain works', () => {
        // Works on container size
        expect(getChartPositionMain(mockOpts, 'main')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'brush')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'lithology')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'construction')(store.getState())).not.toBe(null);

        // Works with specific container size
        store.dispatch(setContainerSizeMain(mockOpts.id, {width: 10, height: 20}));
        expect(getContainerSizeMain(mockOpts)(store.getState())).toEqual({width: 10, height: 20});
        expect(getChartPositionMain(mockOpts, 'main')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'brush')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'lithology')(store.getState())).not.toBe(null);
        expect(getChartPositionMain(mockOpts, 'construction')(store.getState())).not.toBe(null);
    });

    it('setAxisYMainBBox and getAxisYMainBBox works', () => {
        const bBox = {x: -10, y: -5, width: 10, height: 20};
        store.dispatch(setAxisYMainBBox(mockOpts.id, bBox));
        expect(getAxisYMainBBox(mockOpts)(store.getState())).toEqual(bBox);
    });

    it('getViewBoxMain works', () => {
        store = getMockStore();
        expect(getViewBoxMain(store.getState())).not.toBe(null);
    });
});
