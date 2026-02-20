"use client";

import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import left_arrow from "../public/svg/black-left-arrow.svg";
import Image from "next/image";
import useSWR from "swr";
import moment from "moment";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch workouts");
    return res.json();
  });

interface WorkoutSuggestion {
  id: string;
  w_title: string;
  w_description: string;
  w_type: string;
  w_calories: string;
  w_time: string;
}

 

interface WorkoutInputData {
  date_of_workout: string;
  workout_id: string;
  comments: string;
}

interface PopupFormData {
  title: string;
  dateSelected: Date;
  show_popup: boolean;
}

interface PopupFormProps {
  setPopupFormData: (data: PopupFormData) => void;
  popupFormData: PopupFormData;
  setUserWorkoutList: React.Dispatch<
    React.SetStateAction<Record<string, UserWorkoutData>>
  >;
}

const PopupFormAddWorkout: React.FC<PopupFormProps> = ({
  setPopupFormData,
  popupFormData,
  setUserWorkoutList,
}) => {
  const getSelectedDateTime = useCallback(() => {
    const now = popupFormData.dateSelected
      ? new Date(popupFormData.dateSelected)
      : new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "T" +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0")
    );
  }, [popupFormData.dateSelected]);

  const selectedDateTime = getSelectedDateTime();
  const [dateTimeErrorClass, setDateTimeErrorClass] = useState("");
  const [workoutTitleErrorClass, setWorkoutTitleErrorClass] = useState("");

  // lock button on save action to prevent multiple submits while waiting for response and show the right text
  const [isSaving, setIsSaving] = useState(false);
  const [saveBtnText, setSaveBtnText] = useState("SAVE");

  const [dateTime, setDateTime] = useState<string>(selectedDateTime);
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutSuggestion>({
    id: "",
    w_title: "",
    w_description: "",
    w_type: "",
    w_calories: "",
    w_time: "",
  });
  const [workoutComments, setWorkoutComments] = useState("");

  useEffect(() => {
    if (!popupFormData.show_popup) return;

    const nextDT = getSelectedDateTime();
    setDateTime(nextDT);

    setWorkoutSelected({
      id: "",
      w_title: "",
      w_description: "",
      w_type: "",
      w_calories: "",
      w_time: "",
    });
    setWorkoutComments("");
    setDateTimeErrorClass("");
    setWorkoutTitleErrorClass("");
  }, [popupFormData.show_popup, getSelectedDateTime]);

  const addWorkoutToDB = async (input_data: WorkoutInputData) => {
    if (isSaving) return false; // ⛔ already saving
    setIsSaving(true); // 🟢 lock
    setSaveBtnText("Saving...");

    const addWorkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/dashboard/add-workout`;
    const res = await fetch(addWorkoutUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input_data),
    });
    const data = await res.json();
    if (data.user_workout_added) {
      // Optimistically update workout list for the selected date
      const dateKey = moment(dateTime).format("YYYY-MM-DD");
      setUserWorkoutList((prev) => ({
        ...prev,
        [dateKey]: {
          id: Number(workoutSelected.id),
          w_title: workoutSelected.w_title,
          w_type: workoutSelected.w_type,
          date_of_workout: dateTime,
        },
      }));

      setDateTime("");
      setWorkoutSelected({
        id: "",
        w_title: "",
        w_description: "",
        w_type: "",
        w_calories: "",
        w_time: "",
      });
      setWorkoutComments("");
      setPopupFormData({ title: "", dateSelected: new Date(), show_popup: false });
      setSaveBtnText("Save");
      setIsSaving(false); // 🔓 unlock
      return true;
    }

    if (data.code === "workout_exists") {
      alert(data.message);
    } else {
      alert("Something went wrong!");
    }
    setSaveBtnText("Save");
    setIsSaving(false); // 🔓 unlock
    return false;
  };

  const handleWorkoutSuggestionsInputChange = (
    _: React.SyntheticEvent,
    newValue: WorkoutSuggestion | null
  ) => {
    if (newValue) setWorkoutSelected(newValue);
  };

  const handleWorkoutComments = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorkoutComments(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let doSubmit = true;

    if (!workoutSelected.id) {
      doSubmit = false;
      setWorkoutTitleErrorClass("error2");
    } else {
      setWorkoutTitleErrorClass("");
    }

    if (!dateTime) {
      doSubmit = false;
      setDateTimeErrorClass("error");
    } else {
      setDateTimeErrorClass("");
    }

    if (doSubmit) {
      const input_data: WorkoutInputData = {
        date_of_workout: dateTime,
        workout_id: workoutSelected.id,
        comments: workoutComments,
      };
      await addWorkoutToDB(input_data);
    }
  };

  const handleClosePopupForm = () => {
    setPopupFormData({ title: "", dateSelected: new Date(), show_popup: false });
  };

  const {
    data: suggestionWorkouts = [],
    error,
    isLoading,
  } = useSWR<WorkoutSuggestion[]>("/api/get-all-workouts", fetcher, {
    dedupingInterval: 60_000, // 1 minute
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading || error) {
    return <></>;
  }

  return (
    <div
      className={`modal fade logout-modal popupform-complete-modal ${
        popupFormData.show_popup ? "show-modal" : ""
      }`}
      id="workout-complete-modal"
      onClick={handleClosePopupForm}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-body">
            <div className="close-popup-left-arrow">
              <Image
                src={left_arrow}
                alt="back-btn-icon"
                className="scale13"
                onClick={handleClosePopupForm}
              />
            </div>
            <h1 className="modal-title text-center mb-4 sm-font-zen fw-400 mt-[-21px]">
              {popupFormData.title}
            </h1>
            <form className="feedback-form" onSubmit={handleFormSubmit}>
              <div className="addmeal-div feedback-email">
                <label htmlFor="datetime-local" className="custom-lbl-feedback">
                  Date & Time of workout*
                </label>
                <input
                  type="datetime-local"
                  id="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className={`border-green-1 ${dateTimeErrorClass}`}
                />
              </div>
              <div className="addmeal-div feedback-email">
                <label htmlFor="workout-short" className="custom-lbl-feedback">
                  Workout*
                </label>
                <Autocomplete
                  className={`Autocomplete-green ${workoutTitleErrorClass}`}
                  value={workoutSelected}
                  options={suggestionWorkouts}
                  getOptionLabel={(option) =>
                    option.w_title !== ""
                      ? `${option.w_type}: ${option.w_title} - ${option.w_time} min`
                      : ""
                  }
                  onChange={handleWorkoutSuggestionsInputChange}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField {...params} label="" variant="outlined" />
                  )}
                />
              </div>
              <div className="addmeal-div">
                <label htmlFor="workout-details" className="custom-lbl-feedback">
                  Details
                </label>
                <div
                  className="sm-font-sans custom-textarea-div border-green-1"
                  id="workout-details"
                >
                  <table>
                    <tbody>
                      <tr>
                        <td>Description:</td>
                        <td>
                          {workoutSelected && workoutSelected.w_description !== ""
                            ? workoutSelected.w_description
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td>Type:</td>
                        <td>
                          {workoutSelected && workoutSelected.w_type !== ""
                            ? workoutSelected.w_type
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td>Time:</td>
                        <td>
                          {workoutSelected && workoutSelected.w_time !== ""
                            ? `${workoutSelected.w_time} min`
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Calories:</b>
                        </td>
                        <td>
                          <b>
                            {workoutSelected && workoutSelected.w_calories !== ""
                              ? `${workoutSelected.w_calories} kcal`
                              : ""}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="addmeal-div">
                <label htmlFor="comments" className="custom-lbl-feedback">
                  Comments
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  placeholder="Write here..."
                  className="sm-font-sans custom-textarea border-green-1"
                  id="comments"
                  value={workoutComments}
                  onChange={handleWorkoutComments}
                ></textarea>
              </div>
              <div className="green-btn mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-full"
                >
                  {saveBtnText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupFormAddWorkout;
