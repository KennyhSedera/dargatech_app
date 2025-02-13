import React from 'react'
import Modal from './Modal'

const ConfirmDialog = ({
    message = '',
    title = 'Confirmation',
    btnCloseName = 'Annuler',
    btnAcceptName = 'Confirmer',
    open = false,
    close = () => { },
    accept = () => { },
    btnCloseColor = 'bg-gray-400 text-white',
    btnAcceptColor = ' text-white'
}) => {
    const onClose = () => {
        close();
    }
    return (
        <Modal
            maxWidth='md'
            show={open}
            onClose={onClose}
            closeOnOutsideClick={true}
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div id="modal-title" className="text-xl font-semibold mb-4">
                {title}
            </div>

            <div className="mb-6">
                {message}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    className={`w-full ${btnCloseColor} rounded-md py-1 hover:opacity-90 transition-opacity`}
                    onClick={onClose}
                >
                    {btnCloseName}
                </button>
                <button
                    className={`w-full ${btnAcceptColor} rounded-md py-1 hover:opacity-90 transition-opacity`}
                    onClick={accept}
                >
                    {btnAcceptName}
                </button>
            </div>
        </Modal>

    )
}

export default ConfirmDialog
