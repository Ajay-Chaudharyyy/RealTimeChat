import { useState } from 'react';

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
          className="sr-only"
        />
        <div
          className={`w-8 h-4 rounded-full transition-colors ${
            enabled ? 'bg-[#005DFF]' : 'bg-gray-400'
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-4' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
