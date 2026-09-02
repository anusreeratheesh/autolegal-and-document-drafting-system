import React from 'react';

function AvailabilityToggle() {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Availability:</span>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Available
            </button>
        </div>
    );
}

export default AvailabilityToggle;
