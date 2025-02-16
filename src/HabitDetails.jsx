import { useLocation, useNavigate, useParams } from "react-router";
import { account, databases, ID } from "./config/appwriteConfig";
import { useAuth } from "./context/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Query } from "appwrite";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function HabitDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [dateValue, setDateValue] = useState("");

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  async function fetchHabitDetails() {
    try {
      const response = await databases.listDocuments(
        "67b0bdc9002836425c2f",
        "67b12fed0007cd299fe3",
        [Query.equal("habitId", id)]
      );

      return response.documents;
    } catch (error) {
      console.error(error);
    }
  }

  const {
    data: habitDetails,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["habitDetailsData"],
    queryFn: fetchHabitDetails,
  });

  console.log(habitDetails);

  async function commitDay() {
    if (!user) return; // Ensure user is logged in before adding habit
    try {
      if (dateValue === "") {
        return
      }

      if (habitDetails.filter(habit => habit.date === dateValue).length > 0) {
        return
      }
      const response = await databases.createDocument(
        "67b0bdc9002836425c2f",
        "67b12fed0007cd299fe3",
        ID.unique(),
        {
          name: location?.state?.name,
          date: dateValue,
          completed: true,
          habitId: id,
        }
      );

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const commitDayMutation = useMutation({
    mutationFn: commitDay,
    onSuccess: () => {
      // Invalidate and refetch
      refetch();
    },
  });

  const renderSquares = () => {
    const startDate = new Date(currentYear, 0, 1); // January 1, current year
    const weeks = [];
  
    // Group squares by weeks (52 weeks in a year)
    for (let week = 0; week < 52; week++) {
      const weekSquares = [];
  
      // Each week has 7 days (Sunday to Saturday)
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7 + day)); // Calculate the date
  
        // Skip dates that are not in the current year
        if (currentDate.getFullYear() !== currentYear) {
          weekSquares.push(<li key={`${week}-${day}`} className="empty"></li>);
          continue;
        }
  
        const dateArr = currentDate.toLocaleDateString('en-US').split("/");
        const month = dateArr[0].length === 1 ? "0" + dateArr[0] : dateArr[0];
        const dayOfMonth = dateArr[1].length === 1 ? "0" + dateArr[1] : dateArr[1];
        const date = dateArr[dateArr.length - 1] + "-" + month + "-" + dayOfMonth;
  
        const isCompleted = habitDetails?.some(habit => habit.date === date);
  
        weekSquares.push(
          <li key={`${week}-${day}`} className={`${isCompleted ? 'completed' : ''} tooltip`}>
            <span className="tooltiptext">{currentDate.toDateString()}</span>
          </li>
        );
      }
  
      weeks.push(
        <ul key={week} className="week">
          {weekSquares}
        </ul>
      );
    }
  
    return weeks;
  };

  const calculateStreak = () => {
    let streak = 0
    let largestStreak = 0

    for (let i = 0; i < habitDetails?.length - 1; i++) {
      const currentDate = new Date(habitDetails[i].date)
      const nextDate = new Date(habitDetails[i + 1].date)

      const timeDifference = nextDate.getTime() - currentDate.getTime()
      const oneDay = 1000 * 60 * 60 * 24

      if (timeDifference <= oneDay && habitDetails[i].completed && habitDetails[i + 1].completed) {
        streak++
      } else {
        if (habitDetails[i].completed) {
          streak++
          largestStreak = Math.max(streak, largestStreak)
        }
        streak = 0
      }
    }

    if (habitDetails?.length > 0 && habitDetails[habitDetails.length - 1].completed) {
      streak++
      largestStreak = Math.max(streak, largestStreak)
    }

    return largestStreak
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <section className="flex flex-col items-center justify-center mt-20">

      <section>
        <h2 className="mb-6 font-[Sigmar] text-3xl">Habit Details for {currentYear}</h2>

        <section className="flex items-center justify-center space-x-4">
          <input
            className="input"
            type="date"
            placeholder="Title"
            value={dateValue}
            min={minDate}
            onChange={(e) => setDateValue(e.target.value)}
          />
          <button className="button" onClick={() => commitDayMutation.mutate()}>Commit</button>
        </section>

        <section className="mt-8">
          <h2>Habit Name: <span className="uppercase text-amber-700 font-medium">{location?.state?.name}</span></h2>

          {/* <ul>
            <li>Total Tracking Days: </li>
            <li>Largest Streak 6</li>
          </ul> */}

          <div className="stats bg-base-100 border border-base-300 mt-6">
            <div className="stat">
              <div className="stat-title">Total Tracking Days</div>
              <div className="stat-value">{habitDetails ? habitDetails?.length : 0}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Largest Streak</div>
              <div className="stat-value">{calculateStreak()}</div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {/* github graph */}
          {/* <h2>Habit Details for {currentYear}</h2> */}
          <section className="flex items-center justify-center space-x-4 mb-4">
            <button className="button" onClick={() => setCurrentYear(currentYear - 1)}><IoIosArrowBack /></button>
            <button className="button" onClick={() => setCurrentYear(currentYear + 1)}><IoIosArrowForward /></button>
          </section>

          <div className="graph">
            {/* Months Row */}
            <ul className="months">
              <li>Jan</li>
              <li>Feb</li>
              <li>Mar</li>
              <li>Apr</li>
              <li>May</li>
              <li>Jun</li>
              <li>Jul</li>
              <li>Aug</li>
              <li>Sep</li>
              <li>Oct</li>
              <li>Nov</li>
              <li>Dec</li>
            </ul>

            {/* Days Column and Squares Grid */}
            <div style={{ display: "flex" }}>
              {/* Days Column */}
              <ul className="days">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
              </ul>

              {/* Squares Grid */}
              <ul className="squares">{renderSquares()}</ul>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
