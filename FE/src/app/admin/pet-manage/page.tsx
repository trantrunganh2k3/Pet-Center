'use client';
import React, { useState } from "react";
import { usePets } from "@/data/PetsData";
import { Pet, PetFormData } from '@/types/interfaces';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import ConfirmationDialog from '@/components/ConfirmationDialog';

const PetManagement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [crOpen, setCrOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'age' | 'weight'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [formData, setFormData] = useState<Partial<PetFormData>>({
        name: '',
        species: '',
        age: 0,
        weight: 0,
        gender: 'MALE',
        color: '',
    });

    const [newPet, setNewPet] = useState<PetFormData>({
        name: '',
        species: '',
        age: 0,
        weight: 0,
        gender: 'MALE',
        color: '',
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState<string | null>(null);

    const {
        pets,
        loading,
        error,
        createPet,
        updatePet,
        deletePet
    } = usePets();

    const handleEdit = (pet: Pet) => {
        setSelectedPet(pet);
        setFormData({
            name: pet.name,
            species: pet.species,
            age: pet.age,
            weight: pet.weight,
            gender: pet.gender,
            color: pet.color,
        });
        setIsOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'age' || name === 'weight') {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleNewPetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'age' || name === 'weight') {
            setNewPet({
                ...newPet,
                [name]: parseFloat(value) || 0
            });
        } else {
            setNewPet({
                ...newPet,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPet) {
            const success = await updatePet(selectedPet.petId, formData);
            if (success) {
                setIsOpen(false);
            }
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createPet(newPet, '1'); // TODO: Get customerId from context or prop
        if (success) {
            setCrOpen(false);
            setNewPet({
                name: '',
                species: '',
                age: 0,
                weight: 0,
                gender: 'MALE',
                color: '',
            });
        }
    };

    const handleDeleteClick = (id: string) => {
        setPetToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (petToDelete) {
            await deletePet(petToDelete);
            setDeleteDialogOpen(false);
            setPetToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setPetToDelete(null);
    };

    // Filter and sort pets
    const filteredPets = pets
        .filter(pet => 
            (pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pet.species.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedSpecies ? pet.species === selectedSpecies : true) &&
            (selectedGender !== 'ALL' ? pet.gender === selectedGender : true)
        )
        .sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            if (sortBy === 'name') return a.name.localeCompare(b.name) * order;
            if (sortBy === 'age') return (a.age - b.age) * order;
            return (a.weight - b.weight) * order;
        });

    const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species)));
    
    return (
        <ErrorBoundary>
            <div className="container mx-auto mt-8 px-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Lỗi! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <h2 className="text-2xl font-bold text-gray-800">Danh sách thú cưng</h2>
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    value={selectedSpecies} 
                                    onChange={(e) => setSelectedSpecies(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả giống loài</option>
                                    {uniqueSpecies.map(species => (
                                        <option key={species} value={species}>{species}</option>
                                    ))}
                                </select>
                                <select 
                                    value={selectedGender} 
                                    onChange={(e) => setSelectedGender(e.target.value as 'ALL' | 'MALE' | 'FEMALE')}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="ALL">Tất cả giới tính</option>
                                    <option value="MALE">Đực</option>
                                    <option value="FEMALE">Cái</option>
                                </select>
                                <button 
                                    onClick={() => setCrOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Thêm thú cưng
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giống loài
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tuổi
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cân nặng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giới tính
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Màu sắc
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <LoadingSkeleton rows={5} />
                                        </td>
                                    </tr>
                                ) : filteredPets.length > 0 ? (
                                    filteredPets.map((pet, index) => (
                                        <tr key={pet.petId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-800 font-medium text-sm">
                                                            {pet.name.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{pet.species}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{pet.age}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{pet.weight} kg</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {pet.gender === 'MALE' ? 'Đực' : 'Cái'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{pet.color}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleEdit(pet)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-1 mr-2 transition duration-150 ease-in-out"
                                                >
                                                    Sửa
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(pet.petId)}
                                                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md px-3 py-1 transition duration-150 ease-in-out"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không có dữ liệu thú cưng nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredPets.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{filteredPets.length}</span> thú cưng
                                {searchTerm && <span> (đã lọc từ {pets.length} thú cưng)</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'age' | 'weight')}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="name">Sắp xếp theo tên</option>
                                    <option value="age">Sắp xếp theo tuổi</option>
                                    <option value="weight">Sắp xếp theo cân nặng</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-1 rounded hover:bg-gray-100"
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {isOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin thú cưng</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Tên thú cưng
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                                            Giống loài
                                        </label>
                                        <input
                                            type="text"
                                            name="species"
                                            id="species"
                                            value={formData.species}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                            Tuổi
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            id="age"
                                            min="0"
                                            step="1"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                            Cân nặng (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            id="weight"
                                            min="0"
                                            step="0.1"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Giới tính
                                        </label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        >
                                            <option value="MALE">Đực</option>
                                            <option value="FEMALE">Cái</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                                            Màu sắc
                                        </label>
                                        <input
                                            type="text"
                                            name="color"
                                            id="color"
                                            value={formData.color}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {crOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Thêm thú cưng mới</h3>
                            </div>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">
                                            Tên thú cưng
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="new-name"
                                            value={newPet.name}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                            placeholder="Nhập tên thú cưng"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-species" className="block text-sm font-medium text-gray-700">
                                            Giống loài
                                        </label>
                                        <input
                                            type="text"
                                            name="species"
                                            id="new-species"
                                            value={newPet.species}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                            placeholder="Nhập giống loài"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-age" className="block text-sm font-medium text-gray-700">
                                            Tuổi
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            id="new-age"
                                            min="0"
                                            step="1"
                                            value={newPet.age}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                            placeholder="Nhập tuổi"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-weight" className="block text-sm font-medium text-gray-700">
                                            Cân nặng (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            id="new-weight"
                                            min="0"
                                            step="0.1"
                                            value={newPet.weight}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                            placeholder="Nhập cân nặng"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-gender" className="block text-sm font-medium text-gray-700">
                                            Giới tính
                                        </label>
                                        <select
                                            name="gender"
                                            id="new-gender"
                                            value={newPet.gender}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        >
                                            <option value="MALE">Đực</option>
                                            <option value="FEMALE">Cái</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="new-color" className="block text-sm font-medium text-gray-700">
                                            Màu sắc
                                        </label>
                                        <input
                                            type="text"
                                            name="color"
                                            id="new-color"
                                            value={newPet.color}
                                            onChange={handleNewPetChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                            placeholder="Nhập màu sắc"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setCrOpen(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                                    >
                                        Thêm thú cưng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmationDialog
                    isOpen={deleteDialogOpen}
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa thú cưng này?"
                    confirmLabel="Xóa"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            </div>
        </ErrorBoundary>
    );
};

export default PetManagement;
