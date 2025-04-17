import { FaEnvelope, FaUserAlt, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const TechnicienCard = ({ technician, onDelete, onView }) => {
  const colors = ['#6B7280', '#4B5563', '#374151', '#1F2937', '#111827', '#6B7280'];
  const bgColor = colors[technician.id % colors.length];
  
  const firstLetter = technician.name.charAt(0).toUpperCase();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      
      <div className="">
        <div className="flex px-6 py-5 items-center mb-4 bg-gradient-to-br dark:from-blue-500 dark:to-purple-500 from-red-500 to-orange-500">
          <div className="w-14 h-14 rounded-lg mr-4 overflow-hidden flex items-center border-2 border-gray-200 dark:border-gray-700 justify-center bg-gray-100 dark:bg-gray-700">
            {technician.photo ? (
              <img 
                src={technician.photo} 
                alt={technician.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.backgroundColor = bgColor;
                  e.target.parentNode.innerHTML = firstLetter;
                }}
              />
            ) : (
              <FaUserAlt className="text-gray-500 text-2xl" />
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-100 mb-1">{technician.name}</h3>
            <p className="text-gray-400 font-medium">{technician.speciality}</p>
          </div>
        </div>
        
        <div className="space-y-3 px-6 pt-2 pb-5">
          <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium truncate" title={technician.email}>
              {technician.email}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FaUserAlt className="text-gray-500 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{technician.genre}</span>
            </div>
            
            <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FaPhone className="text-gray-500 text-lg dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{technician.contact}</span>
            </div>
          </div>
          
          <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300 text-sm">{technician.adress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicienCard;
