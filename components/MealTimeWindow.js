/**
 * MealTimeWindow Component
 * Displays information about the next meal time window
 */

export default function MealTimeWindow({ mealWindow }) {
  if (!mealWindow) {
    return null;
  }

  const { mealType, startTime, endTime, location, isActive } = mealWindow;

  // Check if current time is within the meal window
  const getStatus = () => {
    if (isActive) {
      return {
        text: 'Active Now',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      };
    }
    return {
      text: 'Upcoming',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    };
  };

  const status = getStatus();

  return (
    <div className="card border-l-4 border-l-primary-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Next Meal Window</h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
          {status.icon}
          <span className="ml-1">{status.text}</span>
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{mealType}</span>
          <span className="mx-2">•</span>
          <span>{startTime} - {endTime}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}

