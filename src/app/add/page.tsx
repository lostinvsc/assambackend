"use client";

import { useState, useEffect } from "react";
import Header from "../Components/Header";


interface Application {
  _id: string;
  fullName: string;
  age: number;
  phoneNo: string;
  gender: string;
  occupation: string;
  address: string;
  category: string;
  area: string;
  remarks?: string;
  documenturl?: string;
  status: string;
  notification: boolean;
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    phoneNo: "",
    gender: "",
    occupation: "",
    address: "",
    category: "",
    area: "",
    remarks: "",
    documenturl: "",
  });

  const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/applications");
      const data = await res.json();
      setApplications(data.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Application submitted successfully!");
        setForm({
          fullName: "",
          age: "",
          phoneNo: "",
          gender: "",
          occupation: "",
          address: "",
          category: "",
          area: "",
          remarks: "",
          documenturl: "",
        });
        fetchApplications();
      } else {
        alert("Error submitting application");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Update application status
  const updateStatus = async (applicationId: string, status: string) => {
    console.log(applicationId, status);
    try {
      await fetch("http://localhost:3000/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Application Form</h1>
      
//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow">
//         <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="text" name="phoneNo" placeholder="Phone No" value={form.phoneNo} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded">
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         <input type="text" name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <select name="category" value={form.category} onChange={handleChange} required className="w-full p-2 border rounded">
//           <option value="">Select Category</option>
//           <option value="Administration">Administration</option>
//           <option value="Legal">Legal</option>
//           <option value="Business">Business</option>
//           <option value="Others">Others</option>
//           <option value="Education">Education</option>
//           <option value="Finance">Finance</option>
//           <option value="Disaster Relief">Disaster Relief</option>
//         </select>
//         <select name="area" value={form.area} onChange={handleChange} required className="w-full p-2 border rounded">
//           <option value="">Select Area</option>
//           <option value="Village">Village</option>
//           <option value="Town">Town</option>
//           <option value="Tehsil">Tehsil</option>
//           <option value="Development Block">Development Block</option>
//         </select>
//         <input type="text" name="remarks" placeholder="Remarks (optional)" value={form.remarks} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="url" name="documenturl" placeholder="Document URL (optional)" value={form.documenturl} onChange={handleChange} className="w-full p-2 border rounded" />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Submit Application</button>
//       </form>

//       {/* Applications List */}
//       <h2 className="text-xl font-bold mt-6">Submitted Applications</h2>
//       <table className="w-full mt-4 border-collapse border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Full Name</th>
//             <th className="border p-2">Category</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Update</th>
//           </tr>
//         </thead>
//         <tbody>
//           {applications.map((app) => (
//             <tr key={app._id} className="border">
//               <td className="border p-2">{app.fullName}</td>
//               <td className="border p-2">{app.category}</td>
//               <td className="border p-2">{app.status}</td>
//               <td className="border p-2">
//                 <select
//                   value={app.status}
//                   onChange={(e) => updateStatus(app._id, e.target.value)}
//                   className="p-1 border rounded"
//                 >
//                   {STATUS_OPTIONS.map((status) => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



return (<>
<Header/>
  <div className="max-w-5xl mx-auto p-6 bg-teal-900 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-center mb-4 text-white-900">Add Application</h2>
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-gray-300 p-6 rounded-lg text-black">
      {/* Left Side Inputs */}
      <div className="space-y-4 text-black">
        <div>
          <label className="block font-semibold">Full name:</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Enter your name" />
        </div>
        <div>
          <label className="block font-semibold">Age:</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Enter your age" />
        </div>
        <div>
          <label className="block font-semibold">Phone No.:</label>
          <input type="text" name="phoneNo" value={form.phoneNo} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Enter your mobile number" />
        </div>
        <div>
          <label className="block font-semibold">Gender:</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">What’s your gender?</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Occupation:</label>
          <input type="text" name="occupation" value={form.occupation} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Where do you work?" />
        </div>
        <div>
          <label className="block font-semibold">Address:</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Where do you live?" />
        </div>
      </div>

      {/* Right Side Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Category of application:</label>
          <select name="category" value={form.category} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select category</option>
            <option value="Legal">Legal</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Area:</label>
          <select name="area" value={form.area} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select area of residence</option>
            <option value="Village">Village</option>
            <option value="Town">Town</option>
            <option value="Tehsil">Tehsil</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Add remarks:</label>
          <input type="text" name="remarks" value={form.remarks} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Add text" />
        </div>
        <div>
          <label className="block font-semibold">Upload document:</label>
          <input type="file" name="document" onChange={handleChange } className="w-full p-2 border rounded" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2 text-center">
        <button type="submit" className="bg-teal-900 text-white px-6 py-2 rounded hover:bg-teal-700">Submit</button>
      </div>
    </form>
  </div></>
);
}
