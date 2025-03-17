import { useLocation, useParams } from "react-router";
import { databases, ID } from "./config/appwriteConfig";
import { useAuth } from "./context/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Query } from "appwrite";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdEditCalendar } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { type Models } from 'appwrite';

export default function HabitDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [dateValue, setDateValue] = useState("");

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [description, setDescription] = useState("");

  const [errorValue, setErrorValue] = useState<string | null>(null);

  const [selectedDayId, setSelectedDayId] = useState("");

  async function fetchHabitDetails(): Promise<Models.DocumentList<Models.Document>> {
    try {
      if (!id) {
        throw new Error("Habit Id is invalid");
      }

      const response = await databases.listDocuments(
        "67b0bdc9002836425c2f",
        "67b12fed0007cd299fe3",
        [Query.equal("habitId", id), Query.orderDesc('date'), Query.equal("year", String(currentYear))]
      );

      return response;
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  }

  const {
    data: habitDetails,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["habitDetailsData", String(currentYear)],
    queryFn: fetchHabitDetails,
  });


  async function commitDay() {
    if (!user) return; // Ensure user is logged in before adding habit
    try {
      if (dateValue === "") {
        return;
      }

      if (habitDetails?.documents && habitDetails?.documents.filter((habit) => habit.date === dateValue).length > 0) {
        return;
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
          description: description,
          year: String(currentYear)
        }
      );

      return response;
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  }

  const commitDayMutation = useMutation({
    mutationFn: commitDay,
    onSuccess: () => {
      // Invalidate and refetch
      refetch();
    },
    onError: (error) => {
      setErrorValue((error as Error).message);
      setTimeout(() => {
        setErrorValue(null);
      }, 3000);
    }
  });

  async function editCommit({ documentId, dateValue, description }: { documentId: string, dateValue: string, description: string }) {
    if (!user) return; // Ensure user is logged in before adding habit
    try {
      const response = await databases.updateDocument(
        "67b0bdc9002836425c2f",
        "67b12fed0007cd299fe3",
        documentId,
        {
          date: dateValue,
          description: description
        }
      );
      
      return response;
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  }

  const editCommitMutation = useMutation({
    mutationFn: editCommit,
    onSuccess: () => {
      // Invalidate and refetch
      setSelectedDayId("")
      refetch();
    },
    onError: (error) => {
      setErrorValue((error as Error).message);
      setTimeout(() => {
        setErrorValue(null);
      }, 3000);
    }
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

        const dateArr = currentDate.toLocaleDateString("en-US").split("/");
        const month = dateArr[0].length === 1 ? "0" + dateArr[0] : dateArr[0];
        const dayOfMonth =
          dateArr[1].length === 1 ? "0" + dateArr[1] : dateArr[1];
        const date =
          dateArr[dateArr.length - 1] + "-" + month + "-" + dayOfMonth;

        const isCompleted = habitDetails?.documents?.some((habit) => habit.date === date);

        weekSquares.push(
          <li
            key={`${week}-${day}`}
            className={`${isCompleted ? "completed" : ""} tooltip`}
          >
            <span className="tooltiptext flex flex-col gap-2">
              <span>{currentDate.toDateString()}</span>
              <span>{habitDetails?.documents?.find(e => e?.date == date)?.description}</span>
            </span>
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
    let streak = 0;
    let largestStreak = 0;

    if (!habitDetails?.documents) {
      return
    }

    for (let i = 0; i < habitDetails?.documents?.length - 1; i++) {
      const currentDate = new Date(habitDetails?.documents[i].date);
      const nextDate = new Date(habitDetails?.documents[i + 1].date);

      const timeDifference = nextDate.getTime() - currentDate.getTime();
      const oneDay = 1000 * 60 * 60 * 24;

      if (
        timeDifference <= oneDay &&
        habitDetails.documents?.[i].completed &&
        habitDetails.documents?.[i + 1].completed
      ) {
        streak++;
      } else {
        if (habitDetails.documents[i].completed) {
          streak++;
          largestStreak = Math.max(streak, largestStreak);
        }
        streak = 0;
      }
    }

    if (
      habitDetails?.documents &&
      habitDetails?.documents?.length > 0 &&
      habitDetails?.documents?.[habitDetails?.documents?.length - 1].completed
    ) {
      streak++;
      largestStreak = Math.max(streak, largestStreak);
    }

    return largestStreak;
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <section className="flex flex-col items-center justify-center mt-0">

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog" className="flex justify-between items-center">
            {/* if there is a button in form, it will close the modal */}
            <span>Commit Form</span>
            <button className="btn btn-xs btn-primary">✕</button>
          </form>
          <form method="dialog" className="w-full p-4 flex flex-col gap-6 bg-base-200 rounded-md mt-4">
            <input
              className="input w-full"
              type="date"
              placeholder="Title"
              value={dateValue}
              min={minDate}
              onChange={(e) => setDateValue(e.target.value)}
            />
            <textarea className="textarea min-h-10 w-full" placeholder="Commit Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <button className="btn btn-primary w-full" onClick={() => commitDayMutation.mutate()}>
              Commit
            </button>
          </form>
        </div>
      </dialog>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form method="dialog" className="flex justify-between items-center">
            {/* if there is a button in form, it will close the modal */}
            <span>Commit History</span>
            <button className="btn btn-xs btn-primary">✕</button>
          </form>
          <section className="w-full p-4 flex flex-col gap-6 bg-base-200 rounded-md mt-4">
            <div className="overflow-x-auto overflow-y-auto min-h-60">
              <table className="table">
                <thead>
                  <tr>
                    {/* <th>No.</th> */}
                    <th>Date</th>
                    <th>Desc.</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {habitDetails && habitDetails.documents.slice(0, 30).map((habit) => {
                    return (
                      <tr key={habit.$id} className="bg-base-200">
                        <th>{habit.date}</th>
                        <td>{habit?.description ? habit?.description?.slice(0, 9) + "..." : "..."}</td>
                        <td><MdEditCalendar onClick={() => {
                          setDateValue(habit.date);
                          setDescription(habit.description);
                          setSelectedDayId(habit.$id);
                          (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal()
                        }} className="cursor-pointer h-5 w-5 text-primary" /></td>
                        <td><MdDelete onClick={async () => {
                          try {
                            await databases.deleteDocument(
                              "67b0bdc9002836425c2f",
                              "67b12fed0007cd299fe3",
                              habit.$id
                            )
                            refetch();
                          } catch (error) {
                            setErrorValue((error as Error).message);
                            setTimeout(() => {
                              setErrorValue(null);
                            }, 3000);
                          }
                      }} className="cursor-pointer h-5 w-5 text-secondary" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </dialog>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog" className="flex justify-between items-center">
            {/* if there is a button in form, it will close the modal */}
            <span>Edit Commit Form</span>
            <button className="btn btn-xs btn-primary">✕</button>
          </form>
          <form method="dialog" className="w-full p-4 flex flex-col gap-6 bg-base-200 rounded-md mt-4">
            <input
              className="input w-full"
              type="date"
              placeholder="Title"
              value={dateValue}
              // min={minDate}
              onChange={(e) => setDateValue(e.target.value)}
            />
            <textarea className="textarea min-h-10 w-full" placeholder="Commit Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <button className="btn btn-primary w-full" onClick={() => editCommitMutation.mutate({ documentId: selectedDayId, dateValue, description })}>
              Save Changes
            </button>
          </form>
        </div>
      </dialog>

      {errorValue && (
        <div className="toast toast-top z-1000">
          <div className="alert alert-error">
            <span>{errorValue}</span>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-2 font-[Sigmar] text-3xl mt-10">
          Habit Details for {currentYear}
        </h2>

        {/* <section className="flex items-center justify-center space-x-4">
          <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box gap-4">
            <input
              className="input w-full"
              type="date"
              placeholder="Title"
              value={dateValue}
              min={minDate}
              onChange={(e) => setDateValue(e.target.value)}
            />
            <textarea className="textarea min-h-10" placeholder="Commit Description (Optional)"></textarea>
            <button className="btn btn-primary" onClick={() => commitDayMutation.mutate()}>
              Commit
            </button>
          </fieldset>
        </section> */}

        <section className="mt-8">
          <h2>
            Habit Name:{" "}
            <span className="uppercase text-amber-700 font-medium">
              {location?.state?.name}
            </span>
          </h2>

          <div className="stats bg-base-200 border border-base-300 mt-8">
            <div className="stat">
              <div className="stat-title">Total Tracking Days</div>
              <div className="stat-value">
                {habitDetails ? habitDetails?.documents?.length : 0}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Largest Streak</div>
              <div className="stat-value">{calculateStreak()}</div>
            </div>
          </div>
        </section>

        <section className="mt-4">
          {/* github graph */}
          <section className="flex items-center justify-between space-x-4 mb-8">

            <div className="flex items-center space-x-4">
              <button className="btn btn-primary" onClick={()=>(document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}>Commit</button>
              <button className="btn btn-secondary" onClick={()=>(document.getElementById('my_modal_2') as HTMLDialogElement).showModal()}>History</button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="btn btn-primary"
                onClick={() => setCurrentYear(currentYear - 1)}
              >
                <IoIosArrowBack />
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentYear(currentYear + 1)}
                disabled={currentYear == new Date().getFullYear()}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </section>

          {!isPending ? <div className="graph">
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
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
              </ul>

              {/* Squares Grid */}
              <ul className="squares">{renderSquares()}</ul>
            </div>
          </div> : <span className="loading loading-infinity loading-md text-secondary"></span>}
        </section> 
      </section>
    </section>
  );
}
