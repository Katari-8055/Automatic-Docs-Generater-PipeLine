export const ApiMethod = ({ method, path, description }) => {
    const methodColors = {
        GET: '#10B981',
        POST: '#3B82F6',
        PUT: '#EAB308',
        DELETE: '#EF4444',
        PATCH: '#8B5CF6',
    };

    const bgColor = methodColors[method?.toUpperCase()] || '#6B7280';

    return (
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-4 mb-2">
                <span
                    className="text-white px-3 py-1 rounded-md font-bold text-sm"
                    style={{ backgroundColor: bgColor }}
                >
                    {method?.toUpperCase() || 'GET'}
                </span>
                <code className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent p-0">
                    {path || '/'}
                </code>
            </div>
            {description && <p className="text-gray-600 dark:text-gray-400 m-0">{description}</p>}
        </div>
    );
};
