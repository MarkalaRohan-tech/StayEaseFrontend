import React, { useState, useEffect } from "react";

const Form5 = ({ onSubmit, onPrev, defaultValues }) => {
  const [owner, setOwner] = useState({
    name: "",
    phone: "",
    email: "",
  });

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
      className="flex flex-col gap-4 sm:gap-5 max-w-2xl mx-auto"
    >
      <div>
        <label className="label font-semibold text-sm sm:text-base">
          Owner Name
        </label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full text-sm sm:text-base"
          value={owner.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="label font-semibold text-sm sm:text-base">Phone</label>
        <input
          type="tel"
          name="phone"
          className="input input-bordered w-full text-sm sm:text-base"
          value={owner.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="label font-semibold text-sm sm:text-base">Email</label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full text-sm sm:text-base"
          value={owner.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row mt-6 gap-3 sm:gap-0 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning w-full sm:w-auto order-2 sm:order-1"
        >
          Previous
        </button>
        <button type="submit" className="btn btn-warning w-full sm:w-auto order-1 sm:order-2">
          Next
        </button>
      </div>
    </form>
  );
};

export default Form5;