import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  additionalInfo: string;
  stars: number;
  user_id: number;
}

const TableTwo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    image: null,
    description: '',
    additionalInfo: '',
    stars: 0,
  });

  const fetchProducts = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data.data);
      console.log(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      data.append('price', formData.price);
      data.append('image', formData.image);
      data.append('description', formData.description);
      data.append('additionalInfo', formData.additionalInfo);
      data.append('stars', formData.stars.toString());

      if (formData.id) {
        await axios.post(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/products/${formData.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Product updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/products`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Product posted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      fetchProducts();
      setFormData({
        id: null,
        name: '',
        price: '',
        image: null,
        description: '',
        additionalInfo: '',
        stars: 0,
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        console.log(e.response.data);
      } else {
        console.log(e);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: null,
      description: product.description,
      additionalInfo: product.additionalInfo,
      stars: product.stars,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`${process.env.REACT_APP_BACKEND_PATH_URL}/api/users/1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Product deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });

      fetchProducts();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-9">
        {/* Create Product */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">{formData.id ? 'Update Product' : 'Create Product'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Product name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Your Product name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter Your Price"
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

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">Additional Info</label>
                <input
                  type="text"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Additional Info"
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

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">Stars</label>
                <input
                  type="number"
                  name="stars"
                  value={formData.stars}
                  onChange={handleInputChange}
                  placeholder="Stars"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">{formData.id ? 'Update Product' : 'Create Product'}</button>
            </div>
          </form>
        </div>

        {/* All Products */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product Name</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Image</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Additional Info</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Stars</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">{product.name}</h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{product.price}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{product.description}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{product.additionalInfo}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{product.stars}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex">
                      <button onClick={() => handleEdit(product)} className="mr-2 rounded bg-blue-500 p-2 text-white">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="rounded bg-red-500 p-2 text-white">Delete</button>
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

export default TableTwo;