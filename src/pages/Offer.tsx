import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

interface Offer {
  id: number;
  name: string;
  discount: string;
  image: string;
  description: string;
}

const Offer: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    discount: '',
    image: null as File | null,
    description: '',
  });

  const fetchOffers = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffers(response.data.data);
      console.log(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('discount', formData.discount);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (formData.id) {
        await axios.put(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/offers/${formData.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Offer updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/offers`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Offer posted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      fetchOffers();
      setFormData({
        id: null,
        name: '',
        discount: '',
        image: null,
        description: '',
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        console.log(e.response.data);
      } else {
        console.log(e);
      }
    }
  };

  const handleEdit = (offer: Offer) => {
    setFormData({
      id: offer.id,
      name: offer.name,
      discount: offer.discount,
      image: null,  // Image needs to be handled separately
      description: offer.description,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Offer deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });

      fetchOffers();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-9">
        {/* Create Offer */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">{formData.id ? 'Update Offer' : 'Create Offer'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Offer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Offer Name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Discount</label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Enter Discount"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">Image <span className="text-meta-1">*</span></label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">Description</label>
                <textarea
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Type Your Description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">{formData.id ? 'Update Offer' : 'Create Offer'}</button>
            </div>
          </form>
        </div>

        {/* All Offers */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Offer Name</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Image</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Discount</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">{offer.name}</h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <img src={offer.image} alt={offer.name} className="w-20 h-20 object-cover" />
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{offer.discount}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{offer.description}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button onClick={() => handleEdit(offer)} className="mr-2 text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(offer.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Offer;
