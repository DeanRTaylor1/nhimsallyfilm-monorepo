
import { Fragment } from 'react';

type ConfirmModalProps = {
  information: string
  confirm: () => void;
  closeModal: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ information, confirm, closeModal
}) => {
  return (
    <Fragment>
      <div className='w-screen h-[1000px] fixed -top-40 left-0 z-20 flex flex-col items-center justify-center '>
        <div className='h-fit w-96  rounded-md shadow-2xl flex flex-col'>
          <form className='h-fit w-96 flex flex-col gap-8 shadow-2xl bg-white  rounded-md px-8 py-4 text-xl font-bold'>
            <div className='py-4 h-20 flex justify-between'>
              {information}
            </div>
            <div className='flex flex-row-reverse gap-2'>
              <button
                className='submitButton w-[calc(50%)] bg-red-400 hover:bg-red-500 focus:bg-red-500 h-[55px]'
                onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                  confirm();
                }}
              >
                Confirm
              </button>
              <button
                className='submitButton w-[calc(50%)] h-[55px]'
                onClick={(e) => {
                  e.preventDefault();
                  closeModal()
                }}
              >
                Go Back
              </button>
            </div>{' '}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmModal;
