"use client";

import React, { FormEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { addUserEmailToProduct } from "@/lib/actions";

interface Props{
  productId:string
}

const Modal = ({productId}:Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setIsSubmitting(true)

    await addUserEmailToProduct(productId , email)

    setIsSubmitting(false)
    setEmail('')
    closeModal()

  }
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          open={isOpen}
          onClose={closeModal}
          className="relative z-50 dialog-container"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition
              show={isOpen} // Add the `show` prop here
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition>
            <span
              className="inline-block h-screen align-middle "
              aria-hidden="true"
            />
            {/* Dialog content */}
            <Transition
              show={isOpen} // Also add the `show` prop here for the dialog content
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  <div className="flex flex-row justify-between ">
                    <Image
                      src="/assets/icons/logo.svg"
                      alt="logo"
                      width={28}
                      height={28}
                    />

                    <button onClick={closeModal} className="button">
                      <Image
                        src="/assets/icons/x-close.svg"
                        alt="close"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                      />
                    </button>
                  </div>
                </h3>

                <div className="mt-2">
                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts right in your
                    inbox!
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">Never miss a bargain again with our timely alerts!</p>
                </div>
                <form className="flex flex-col mt-5 " onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="dialog-input_contsainer">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />
                    <input
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      required
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      className="dialog-input"
                    />
                  </div>
                  <button type="submit" className="dialog-btn">
                    {isSubmitting ? 'Submitting...':"Track" }
                  </button>
                </form>
              </div>
            </Transition>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
