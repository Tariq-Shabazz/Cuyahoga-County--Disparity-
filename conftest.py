# Make the repository root importable when pytest is run from any directory.
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
