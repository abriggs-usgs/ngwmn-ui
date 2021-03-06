import { setSelectedConstructionId, setSelectedLithologyId } from "../../well-log/state";

const LITHOLOGY_COLORS = [
    '#9A887E',
    '#72655C',
    '#F0E68C',
    '#C6BBB7'
];

// Convert a hexidecimal color string to [0...1, 0...1, 0...1]
export const rgbFromHex = function (hexString) {
    const intColor = parseInt(hexString.slice(1), 16);
    const red = intColor >> 16;
    const green = intColor >> 8 & 0xFF;
    const blue = intColor & 0xFF;
    return [
        red / 255,
        green / 255,
        blue / 255
    ];
};

export default function (elem, {lithology, visible, selectedLithologyId}, store, siteKey, container) {
    container = container || elem
        .append('g')
            .classed('lithology', true);

    // Remove any previously drawn children
    container.selectAll('*').remove();

    // If we're not visible, return before adding lithology layers
    if (!visible) {
        return container;
    }

    // Draw each lithology layer as a rect with a filter applied
    for (let i = 0; i < lithology.length; i++) {
        const layer = lithology[i];
        const color = layer.colors.length ? layer.colors[0] : LITHOLOGY_COLORS[i % LITHOLOGY_COLORS.length];
        const [r, g, b] = rgbFromHex(color);
        container
            .append('filter')
                .attr('id', `filter-${i}`)
                .append('feColorMatrix')
                    .attr('in', 'SourceGraphic')
                    .attr('type', 'matrix')
                    .attr('values', `0 0 0 ${r} 0 ` +
                                    `0 0 0 ${g} 0 ` +
                                    `0 0 0 ${b} 0 ` +
                                    '0 0 0 1 0');
        container
            .append('rect')
                .attr('x', layer.x)
                .attr('y', layer.y)
                .attr('width', layer.width)
                .attr('height', layer.height)
                .attr('fill', `url(#lithology-${layer.materials[0]})`)
                .attr('filter', `url(#filter-${i})`)
                .classed('selected', layer.id == selectedLithologyId)
                // Clear selection on mouse exit
                .on('mouseout', function () {
                    store.dispatch(setSelectedLithologyId(siteKey, null));
                })
                // On click, store the selected row in state.
                .on('mouseover', function () {
                    store.dispatch(setSelectedLithologyId(siteKey, layer.id))
                })
                .append('title')
                    .text(layer.title);
    }

    return container;
}
