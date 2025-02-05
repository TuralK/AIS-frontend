const ErrorMessage = ({ message }) => {
    return (
        <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mt-2">
            {message}
        </div>
    )
}

export default ErrorMessage
