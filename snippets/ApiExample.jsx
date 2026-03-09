export const ApiExample = ({ request, response }) => {
    const formatJSON = (data) => {
        try {
            if (typeof data === 'string') {
                return JSON.stringify(JSON.parse(data), null, 2);
            }
            return JSON.stringify(data, null, 2);
        } catch (e) {
            return data;
        }
    };

    return (
        <div className="my-8 flex flex-col gap-6">
            {request && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">Example Request</h4>
                    </div>
                    <pre className="m-0 p-4 bg-gray-50 dark:bg-[#0d1117] text-gray-800 dark:text-gray-200 overflow-x-auto text-sm">
                        <code>{formatJSON(request)}</code>
                    </pre>
                </div>
            )}

            {response && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">Example Response</h4>
                    </div>
                    <pre className="m-0 p-4 bg-gray-50 dark:bg-[#0d1117] text-gray-800 dark:text-gray-200 overflow-x-auto text-sm">
                        <code>{formatJSON(response)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
