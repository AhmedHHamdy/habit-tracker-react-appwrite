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

      if (data.filter((habit) => habit.name === habitTitle).length > 0) {
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

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const addHabit = useMutation({
    mutationFn: addHabitFn,
    onSuccess: () => {
      // Invalidate and refetch
      refetch();
      setHabitTitle("");
    },
  });

  return (
    <section className="flex flex-col items-center justify-center mt-10">
      <section className="flex flex-col mt-20">
        <section className="flex items-center space-x-4">
          <input
            className="input w-full"
            type="text"
            placeholder="Habit Title"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
          />
          <button className="button w-52" onClick={() => addHabit.mutate()}>
            Add Habit
          </button>
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-[Sigmar]">Current habits</h2>
          <ul className="list bg-base-100 rounded-box shadow-md mt-10 max-h-72 overflow-y-auto">
            {data &&
              data.map((habit, index) => {
                return (
                  // <Link to={`habitDetails/${habit.$id}`} state={{name: habit?.name}} key={habit.$id}>
                  <li className="list-row" key={habit.$id}>
                    <div>
                      <img className="h-10" src={arr[index % arr.length]} />
                    </div>
                    <div>
                      <div>{habit.name}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        {habit.$createdAt.split("T")[0]}
                      </div>
                    </div>
                    <Link
                      to={`habitDetails/${habit.$id}`}
                      state={{ name: habit?.name }}
                      className="btn btn-square btn-ghost"
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
                        await databases.deleteDocument(
                          "67b0bdc9002836425c2f",
                          "67b130b3003836d9a66a",
                          habit.$id
                        );
                        refetch();
                      }}
                      className="btn btn-square btn-ghost"
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
