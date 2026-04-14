"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
};

const BookEvent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-base font-bold text-center text-cyan-200">
          {" "}
          Thank you for signing up!
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">
              Email Address{" "}
              {errors.email && (
                <span className="text-red-600 text-xs ml-2">
                  {errors.email.message}
                </span>
              )}
            </label>
            <input
              id="email"
              type="email"
              placeholder="youremail@fakemail.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
