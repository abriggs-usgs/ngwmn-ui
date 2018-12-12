"""
Unit tests for string manipulation functions
"""

from unittest import TestCase

from ..string_utils import generate_subtitle


class TestGenerateSubtitle(TestCase):
    def setUp(self):
        self.features_none = {}
        self.features_county = {'COUNTY_NM': 'Dane County'}
        self.features_state = {'STATE_NM': 'Wisconsin'}
        self.features_aquifer = {'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.features_site_type_well = {'SITE_TYPE': 'WELL'}
        self.features_site_type_not_well = {'SITE_TYPE': 'something not a well'}
        self.features_state_n_site = {'STATE_NM': 'Wisconsin', 'SITE_TYPE': 'WELL'}
        self.features_state_county_n_site = {'STATE_NM': 'Wisconsin', 'COUNTY_NM': 'Dane County', 'SITE_TYPE': 'WELL'}
        self.features_state_county_site_n_aquifer = {'STATE_NM': 'Wisconsin', 'COUNTY_NM': 'Dane County', 'SITE_TYPE': 'WELL',
                                                     'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.features_state_county_n_aquifer = {'STATE_NM': 'Wisconsin', 'COUNTY_NM': 'Dane County',
                                                'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.features_site_n_aquifer = {'SITE_TYPE': 'WELL', 'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}

    def test_no_features(self):
        result = generate_subtitle(self.features_none)
        self.assertEqual('', result, 'Expected the results to be blank when no features are present')

    def test_only_county(self):
        result = generate_subtitle(self.features_county)
        self.assertEqual('', result, 'Expected the results to be blank when only the county is in features')

    def test_only_state(self):
        result = generate_subtitle(self.features_state)
        self.assertEqual('This groundwater monitoring location is in Wisconsin.', result,
                         'Result not as expected when only state in features')

    def test_only_aquifer(self):
        result = generate_subtitle(self.features_aquifer)
        self.assertEqual('This groundwater monitoring location is in the cambrian ordovician aquifer system.', result,
                         'Result not as expected when only aquifer is in features')

    def test_site_type_well(self):
        result = generate_subtitle(self.features_site_type_well)
        self.assertEqual('This groundwater monitoring location is associated with a water well.',
                         result, 'Result not as expected when site type is well')

    def test_site_type_not_well(self):
        result = generate_subtitle(self.features_site_type_not_well)
        self.assertEqual('This groundwater monitoring location is associated with a something not a well.',
                         result, 'Result not as expected when site type is something other than a well')

    def test_site_type_n_state(self):
        result = generate_subtitle(self.features_state_n_site)
        self.assertEqual('Located in Wisconsin, this groundwater monitoring location is associated with a water well.',
                         result, 'Result not as expected when site type and state are in features.')

    def test_site_state_n_county(self):
        result = generate_subtitle(self.features_state_county_n_site)
        self.assertEqual('Located in Dane County, Wisconsin, this groundwater monitoring location is associated'
                         ' with a water well.',
                         result, 'Result not as expected when site, state, and county are in features.')

    def test_state_county_site_n_aquifer(self):
        result = generate_subtitle(self.features_state_county_site_n_aquifer)
        self.assertEqual('Located in Dane County, Wisconsin, this groundwater monitoring location is associated with '
                         'a water well in the cambrian ordovician aquifer system.',
                         result, 'Result not as expected when site, state, county, and aquifer are in features.')

    def test_state_county_n_aquifer(self):
        result = generate_subtitle(self.features_state_county_n_aquifer)
        self.assertEqual('Located in Dane County, Wisconsin, this groundwater monitoring location is in the '
                         'cambrian ordovician aquifer system.',
                         result, 'Result not as expected when site, state, and aquifer are in features.')

    def test_site_n_aquifer(self):
        result = generate_subtitle(self.features_site_n_aquifer)
        self.assertEqual('This groundwater monitoring location is associated with a water well in the'
                         ' cambrian ordovician aquifer system.',
                         result, 'Result not as expected when only site and aquifer are in features.')
