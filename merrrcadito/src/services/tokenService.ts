import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TokenPackageDB {
  id: number;
  nombre: string;
  tokens: number;
  precio_real: number;
  imagen_paquete: { type: string; data: number[] } | string;
}

export const getAllTokenPackages = async (): Promise<TokenPackageDB[]> => {
  try {
    const response = await axios.get(`${API_URL}/token_package/get_all`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching packages", error);
    return [];
  }
};

export const createTokenPackage = async (data: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/token_package/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating package", error);
    throw error;
  }
};