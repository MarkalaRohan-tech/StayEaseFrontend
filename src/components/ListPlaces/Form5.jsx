import React, { useState, useEffect } from "react";

const Form5 = ({ onSubmit, onPrev, defaultValues }) => {
  const [owner, setOwner] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // update state whenever defaultValues change
  useEffect(() => {
    if (defaultValues) {
      setOwner({
        name: defaultValues.name || "",
        phone: defaultValues.phone || "",
        email: defaultValues.email || "",
      });
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const ownerData = {
      ownerContact: { ...owner },
    };
    onSubmit(ownerData);
  };

  return (
    <form
      onSubmit={handleNext}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <div>
        <label className="label font-semibold">Owner Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          value={owner.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="label font-semibold">Phone</label>
        <input
          type="tel"
          name="phone"
          className="input input-bordered w-full"
          value={owner.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="label font-semibold">Email</label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          value={owner.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex mt-5 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning"
        >
          Previous
        </button>

        <button type="submit" className="btn btn-warning">
          Next
        </button>
      </div>
    </form>
  );
};

export default Form5;
