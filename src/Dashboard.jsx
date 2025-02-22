import { Link } from "react-router";
import { account, databases, ID } from "./config/appwriteConfig";
import { use, useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { Query } from "appwrite";
import { useMutation, useQuery } from "@tanstack/react-query";
import two from "./assets/2.png";
import three from "./assets/3.png";
import four from "./assets/4.png";
import five from "./assets/5.png";
import { MdDelete } from "react-icons/md";

export default function Dashboard() {
  const [habitTitle, setHabitTitle] = useState("");
  const [errorValue, setErrorValue] = useState(null);

  const { user, logout } = useAuth();

  let arr = [two, three, four, five];

  async function fetchHabits() {
    try {
      const response = await databases.listDocuments(
        "67b0bdc9002836425c2f",
        "67b130b3003836d9a66a",
        [Query.equal("userId", user.$id)]
      );

      return response.documents;
    } catch (error) {
      console.error(error);
    }
  }

  const { data, error, isPending, refetch } = useQuery({
    queryKey: ["habitsList"],
    queryFn: fetchHabits,
  });

  console.log(data);

  async function addHabitFn() {
    if (!user) return; // Ensure user is logged in before adding habit
    try {
      if (habitTitle === "") {
        return;
      }

      if (data?.filter((habit) => habit.name === habitTitle)?.length > 0) {
        return;
      }

      const response = databases.createDocument(
        "67b0bdc9002836425c2f",
        "67b130b3003836d9a66a",
        ID.unique(),
        {
          name: habitTitle,
          userId: user.$id,
        }
      );
      console.log(response)
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  const addHabit = useMutation({
    mutationFn: addHabitFn,
    onSuccess: () => {
      // Invalidate and refetch
      refetch();
      setHabitTitle("");
    },
    onError: (error) => {
      setErrorValue(error.message);
      setTimeout(() => {
        setErrorValue(null);
      }, 3000);
    }
  });

  return (
    <section className="flex flex-col items-center justify-center mt-6">

      {errorValue && (
        <div className="toast toast-top z-1000">
          <div className="alert alert-error">
            <span>{errorValue}</span>
          </div>
        </div>
      )}

      <section className="flex flex-col mt-0 w-full max-w-md space-y-8">
        <section className="flex flex-col gap-7 items-center space-x-4">
         <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box gap-5">
          <input
            className="input w-full"
            type="text"
            placeholder="Habit Title"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
          />
          <button className="btn btn-primary w-full" onClick={() => addHabit.mutate()}>
            Add Habit
          </button>
        </fieldset>
        </section>

        <section className="mt-0">
          <h2 className="text-2xl font-[Sigmar]">Current habits</h2>
          <ul className="list bg-base-200 rounded-box shadow-md mt-10 max-h-72 overflow-y-auto">
            {data &&
              data.map((habit, index) => {
                return (
                  // <Link to={`habitDetails/${habit.$id}`} state={{name: habit?.name}} key={habit.$id}>
                  <li className="list-row" key={habit.$id}>
                    <div className="text-4xl font-thin opacity-30 tabular-nums">{String(index + 1).length == 1 ? 0 + `${index + 1}` : index + 1}</div>
                    <div>
                      <img className="h-10" src={arr[index % arr.length]} />
                    </div>
                    <div className="list-col-grow">
                      <div className="uppercase font-medium">{habit.name}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        {habit.$createdAt.split("T")[0]}
                      </div>
                    </div>
                    <Link
                      to={`habitDetails/${habit.$id}`}
                      state={{ name: habit?.name }}
                      className="btn btn-square btn-primary"
                    >
                      <svg
                        className="size-[1.2em]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                      </svg>
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await databases.deleteDocument(
                            "67b0bdc9002836425c2f",
                            "67b130b3003836d9a66a",
                            habit.$id
                          );
                          refetch();
                        } catch (error) {
                          setErrorValue(error.message);
                            setTimeout(() => {
                              setErrorValue(null);
                            }, 3000);
                        }
                      }}
                      className="btn btn-square btn-secondary"
                    >
                      <MdDelete className="h-5 w-5" />
                    </button>
                  </li>
                  // </Link>
                );
              })}

            {data && data.length === 0 && (
              <li className="list-row">
                <div className="text-center">No habits found</div>
              </li>
            )}
          </ul>
        </section>
      </section>
    </section>
  );
}
