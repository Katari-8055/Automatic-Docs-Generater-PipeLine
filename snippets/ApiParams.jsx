export const ApiParams = ({ params }) => {
    if (!params || params.length === 0) return null;

    return (
        <div className="my-6 block">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Parameters</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm max-w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                            <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                            <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Required</th>
                            <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {params.map((param, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-900">
                                <td className="py-2 px-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">{param.name}</td>
                                <td className="py-2 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{param.type}</td>
                                <td className="py-2 px-4 whitespace-nowrap">
                                    {param.required ? (
                                        <span className="text-red-500 text-xs font-semibold px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded">Required</span>
                                    ) : (
                                        <span className="text-gray-500 text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded">Optional</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 text-gray-600 dark:text-gray-400">{param.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
