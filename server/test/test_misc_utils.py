import unittest
from datetime import datetime
import misc_utils as util


class MiscUtilsTest(unittest.TestCase):

    def test_current_time_has_current_month(self):
        current_month = datetime.now().strftime("%B")
        m, y = util.current_time()

        self.assertEqual(current_month, m)
