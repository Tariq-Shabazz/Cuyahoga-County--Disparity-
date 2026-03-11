"""Tests for analysis.py – verifying correctness of the optimised routines."""

from __future__ import annotations

import math

import numpy as np
import pandas as pd
import pytest

import analysis


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

MUNICIPALITIES = ["Cleveland", "Parma", "Lakewood"]
RACES = ["White", "Black", "Hispanic"]
GENDERS = ["Male", "Female"]


def _make_df(n: int = 300, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    municipality = rng.choice(MUNICIPALITIES, size=n)
    race = rng.choice(RACES, size=n)
    gender = rng.choice(GENDERS, size=n)
    income = rng.integers(20_000, 150_000, size=n).astype(float)
    median_income = rng.integers(50_000, 80_000, size=n).astype(float)
    employment_rate = rng.uniform(0.5, 1.0, size=n)
    income_band = rng.choice(["Low", "Middle", "High"], size=n)

    return pd.DataFrame(
        {
            "municipality": municipality,
            "race": race,
            "gender": gender,
            "income": income,
            "median_income": median_income,
            "employment_rate": employment_rate,
            "income_band": income_band,
        }
    )


@pytest.fixture()
def sample_df() -> pd.DataFrame:
    return _make_df()


# ---------------------------------------------------------------------------
# _apply_efficient_dtypes
# ---------------------------------------------------------------------------


class TestApplyEfficientDtypes:
    def test_race_becomes_categorical(self, sample_df):
        analysis._apply_efficient_dtypes(sample_df)
        assert isinstance(sample_df["race"].dtype, pd.CategoricalDtype)

    def test_gender_becomes_categorical(self, sample_df):
        analysis._apply_efficient_dtypes(sample_df)
        assert isinstance(sample_df["gender"].dtype, pd.CategoricalDtype)

    def test_municipality_becomes_categorical(self, sample_df):
        analysis._apply_efficient_dtypes(sample_df)
        assert isinstance(sample_df["municipality"].dtype, pd.CategoricalDtype)

    def test_income_band_becomes_categorical(self, sample_df):
        analysis._apply_efficient_dtypes(sample_df)
        assert isinstance(sample_df["income_band"].dtype, pd.CategoricalDtype)

    def test_missing_column_is_skipped(self):
        """Should not raise if a categorical column is absent."""
        df = pd.DataFrame({"income": [1.0, 2.0]})
        analysis._apply_efficient_dtypes(df)  # no exception expected


# ---------------------------------------------------------------------------
# compute_disparity_index
# ---------------------------------------------------------------------------


class TestComputeDisparityIndex:
    def test_returns_series_same_length(self, sample_df):
        result = analysis.compute_disparity_index(sample_df)
        assert isinstance(result, pd.Series)
        assert len(result) == len(sample_df)

    def test_values_are_finite(self, sample_df):
        result = analysis.compute_disparity_index(sample_df)
        assert np.isfinite(result.values).all()

    def test_known_value(self):
        df = pd.DataFrame({"income": [100.0], "median_income": [50.0], "employment_rate": [0.8]})
        # (100/50 - 1) * 0.8 * 100 = 1.0 * 0.8 * 100 = 80.0
        result = analysis.compute_disparity_index(df)
        assert math.isclose(result.iloc[0], 80.0)

    def test_zero_disparity(self):
        df = pd.DataFrame({"income": [50.0], "median_income": [50.0], "employment_rate": [0.9]})
        # (50/50 - 1) * 0.9 * 100 = 0
        result = analysis.compute_disparity_index(df)
        assert math.isclose(result.iloc[0], 0.0)


# ---------------------------------------------------------------------------
# add_derived_columns
# ---------------------------------------------------------------------------


class TestAddDerivedColumns:
    def test_does_not_modify_original(self, sample_df):
        original_cols = set(sample_df.columns)
        analysis.add_derived_columns(sample_df)
        assert set(sample_df.columns) == original_cols  # add_derived_columns returns a copy

    def test_new_columns_present(self, sample_df):
        result = analysis.add_derived_columns(sample_df)
        assert "income_ratio" in result.columns
        assert "employment_gap" in result.columns
        assert "disparity_index" in result.columns

    def test_income_ratio_values(self, sample_df):
        result = analysis.add_derived_columns(sample_df)
        expected = sample_df["income"] / sample_df["median_income"]
        pd.testing.assert_series_equal(result["income_ratio"], expected, check_names=False)

    def test_employment_gap_values(self, sample_df):
        result = analysis.add_derived_columns(sample_df)
        expected = 1.0 - sample_df["employment_rate"]
        pd.testing.assert_series_equal(result["employment_gap"], expected, check_names=False)


# ---------------------------------------------------------------------------
# aggregate_by_group
# ---------------------------------------------------------------------------


class TestAggregateByGroup:
    def test_output_columns(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.aggregate_by_group(enriched, ["race"])
        assert "race" in result.columns
        assert "disparity_index_mean" in result.columns
        assert "disparity_index_median" in result.columns
        assert "disparity_index_count" in result.columns

    def test_row_count_matches_groups(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.aggregate_by_group(enriched, ["race"])
        assert len(result) == sample_df["race"].nunique()

    def test_counts_sum_to_total(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.aggregate_by_group(enriched, ["race"])
        assert result["disparity_index_count"].sum() == len(sample_df)


# ---------------------------------------------------------------------------
# build_disparity_report
# ---------------------------------------------------------------------------


class TestBuildDisparityReport:
    def test_returns_dataframe(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.build_disparity_report(enriched)
        assert isinstance(result, pd.DataFrame)

    def test_dimension_column_present(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.build_disparity_report(enriched)
        assert "dimension" in result.columns

    def test_group_value_column_present(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.build_disparity_report(enriched)
        assert "group_value" in result.columns

    def test_contains_race_dimension(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.build_disparity_report(enriched)
        assert (result["dimension"] == "race").any()

    def test_contains_cross_dimension(self, sample_df):
        enriched = analysis.add_derived_columns(sample_df)
        result = analysis.build_disparity_report(enriched)
        assert (result["dimension"] == "race × gender").any()


# ---------------------------------------------------------------------------
# disparity_summary
# ---------------------------------------------------------------------------


class TestDisparitySummary:
    def test_returns_dataframe(self, sample_df):
        result = analysis.disparity_summary(sample_df)
        assert isinstance(result, pd.DataFrame)

    def test_municipality_filter(self, sample_df):
        result_all = analysis.disparity_summary(sample_df)
        result_filtered = analysis.disparity_summary(sample_df, municipality="Cleveland")
        # Filtered result should be a subset (≤) of unfiltered
        assert len(result_filtered) <= len(result_all)

    def test_min_count_filter(self):
        """Groups smaller than min_count should be excluded."""
        df = _make_df(n=90)
        # With min_count=50 several small race×gender combos should be dropped
        result_strict = analysis.disparity_summary(df, min_count=50)
        result_loose = analysis.disparity_summary(df, min_count=1)
        assert len(result_strict) <= len(result_loose)

    def test_unknown_municipality_returns_empty(self, sample_df):
        result = analysis.disparity_summary(sample_df, municipality="Atlantis")
        # All rows are filtered out → report should be empty
        assert len(result) == 0


# ---------------------------------------------------------------------------
# gini_coefficient
# ---------------------------------------------------------------------------


class TestGiniCoefficient:
    def test_perfect_equality(self):
        values = np.ones(100)
        assert math.isclose(analysis.gini_coefficient(values), 0.0, abs_tol=1e-9)

    def test_maximum_inequality(self):
        values = np.zeros(99)
        values = np.append(values, 1.0)  # one person owns everything
        g = analysis.gini_coefficient(values)
        # Gini → (n-1)/n as inequality grows; for n=100 → 0.99
        assert g > 0.95

    def test_empty_array(self):
        assert analysis.gini_coefficient(np.array([])) == 0.0

    def test_known_two_element(self):
        # [0, 1] → Gini = 0.5
        g = analysis.gini_coefficient(np.array([0.0, 1.0]))
        assert math.isclose(g, 0.5, abs_tol=1e-9)

    def test_symmetric(self):
        rng = np.random.default_rng(0)
        values = rng.integers(1, 100, size=200).astype(float)
        g1 = analysis.gini_coefficient(values)
        g2 = analysis.gini_coefficient(values[::-1])
        assert math.isclose(g1, g2)

    def test_range(self):
        rng = np.random.default_rng(1)
        values = rng.integers(1, 100, size=1000).astype(float)
        g = analysis.gini_coefficient(values)
        assert 0.0 <= g <= 1.0


# ---------------------------------------------------------------------------
# load_data (integration)
# ---------------------------------------------------------------------------


class TestLoadData:
    def test_loads_csv_and_applies_dtypes(self, tmp_path):
        df = _make_df(n=50)
        csv_path = tmp_path / "test.csv"
        df.to_csv(csv_path, index=False)

        loaded = analysis.load_data(str(csv_path))
        assert isinstance(loaded["race"].dtype, pd.CategoricalDtype)
        assert isinstance(loaded["gender"].dtype, pd.CategoricalDtype)
        assert len(loaded) == 50
