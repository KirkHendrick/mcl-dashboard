import DailyIncome from "../components/DailyIncome/DailyIncome";
import WaterLogger from "../components/WaterLogger/WaterLogger";
import MorningChecklist from "../components/MorningChecklist/MorningChecklist";
import Chart from "../components/Chart/Chart";
import PomodoroChart from "../components/PomodoroChart";
import TodayInHistory from "../components/TodayInHistory/TodayInHistory";
import RandomQuote from "../components/RandomQuote";
import TodaysPomodoros from "../components/TodaysPomodoros";
import Tasks from '../components/Tasks/Tasks';
import Notes from '../components/Notes/Notes';
import BudgetOverview from "../components/BudgetOverview/BudgetOverview";
import NetWorth from "../components/NetWorth/NetWorth";
import TodaysTasks from "../components/TodaysTasks/TodaysTasks";
import PomodoroTimer from "../components/PomodoroTimer/PomodoroTimer";
import WeightOverTime from "../components/WeightOverTime/WeightOverTime";
import TasksCompleted from "../components/TasksCompleted";
import StateView from "../components/StateView";
import CreateComponent from "../components/CreateComponent/CreateComponent";
import DynamicContainer from "../components/DynamicContainer/DynamicContainer";
import FoodLogger from "../components/FoodLogger";
import ProgressBar from "../components/ProgressBar";
import DailyProgress from "../components/DailyProgress";
import WeeklyProgress from "../components/WeeklyProgress";
import CompulsionLogger from "../components/CompulsionLogger";
import HealthBar from "../components/HealthBar";
import LevelBar from "../components/LevelBar";
import RepeatingRecords from "../components/RepeatingRecords";
import WeightGoalCountdown from "../components/WeightGoalCountdown";

let ComponentIndex = {
	DailyIncome, WaterLogger, MorningChecklist, Chart,
	PomodoroChart, TodayInHistory, RandomQuote, TodaysPomodoros,
	Tasks, Notes, BudgetOverview, NetWorth, TodaysTasks, PomodoroTimer,
	WeightOverTime, TasksCompleted, StateView, CreateComponent, DynamicContainer,
	FoodLogger, ProgressBar, DailyProgress, WeeklyProgress, CompulsionLogger,
	HealthBar, LevelBar, RepeatingRecords, WeightGoalCountdown,
};

export default ComponentIndex;