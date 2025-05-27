'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DeleteVehicleButton({ vehicleID, bucketName = 'vehicles' }) {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [showModal, setShowModal] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteVehicle = async () => {
        setDeleting(true);

        const { data: vehicle, error: fetchError } = await supabase
            .from('vehicles')
            .select('image_url_array')
            .eq('id', vehicleID)
            .single();

        if (fetchError) {
            console.error('Error fetching vehicle data:', fetchError.message);
            setDeleting(false);
            return;
        }

        const imagePaths = vehicle?.image_url_array || [];

        if (imagePaths.length > 0) {
            const { error: storageError } = await supabase
                .storage
                .from(bucketName)
                .remove(imagePaths);

            if (storageError) {
                console.error('Error deleting images:', storageError.message);
                setDeleting(false);
                return;
            }
        }

        const { error: deleteError } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', vehicleID);

        if (deleteError) {
            console.error('Error deleting vehicle:', deleteError.message);
        } else {
            router.push('/dashboard');
        }

        setDeleting(false);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Delete Vehicle
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-red-600">Are you sure?</h2>
                        <p className="text-sm text-gray-700">
                            Deleting this vehicle will permanently remove it and its associated images from your account.
                        </p>
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={confirmChecked}
                                onChange={(e) => setConfirmChecked(e.target.checked)}
                                className="form-checkbox"
                            />
                            <span>I understand and want to delete this vehicle.</span>
                        </label>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmChecked && handleDeleteVehicle()}
                                className={`px-4 py-2 rounded ${
                                    confirmChecked
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-red-300 text-white cursor-not-allowed'
                                }`}
                                disabled={!confirmChecked || deleting}
                            >
                                {deleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
