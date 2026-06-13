'use client';

export default function ReceiptPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg overflow-hidden relative">

        {/* Receipt Dots Top */}
        <div className="flex justify-between px-3 py-1 bg-white">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 bg-black rounded-full -mt-3"
            />
          ))}
        </div>

        <div className="p-8">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-3xl font-bold">PalmPay</h1>
          </div>

          {/* Amount */}
          <div className="text-center">
            <h2 className="text-5xl font-bold text-purple-600">
              ₦ 1,200.00
            </h2>

            <p className="text-2xl font-bold text-[#2A245A] mt-2">
              Successful Transaction
            </p>

            <p className="text-gray-400 font-semibold mt-2">
              Apr 20, 2025 10:54:32 AM
            </p>
          </div>

          <hr className="my-8 border-dashed" />

          {/* Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-3xl text-[#2A245A]">
                Recipient:
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-xl text-[#2A245A]">
                RANDAL CHUKWUWEIKE WILSON
              </p>

              <p className="text-gray-400 font-bold mt-3">
                OPay | 903 237 4880
              </p>
            </div>
          </div>

          <hr className="my-8 border-dashed" />

          {/* Sender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-3xl text-[#2A245A]">
                Sender:
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-xl text-[#2A245A]">
                RANDAL WILSON
              </p>

              <p className="text-gray-400 font-bold mt-3">
                PalmPay | 805***3157
              </p>
            </div>
          </div>

          <hr className="my-8 border-dashed" />

          {/* Transaction Info */}
          <div>
            <h3 className="font-bold text-3xl text-[#2A245A] mb-8">
              Transaction Info:
            </h3>

            <div className="space-y-6">

              <div className="grid grid-cols-2">
                <p className="text-gray-400 font-bold">
                  Transaction Type
                </p>

                <p className="font-bold text-[#2A245A] text-right">
                  Money Transfer - MMO
                </p>
              </div>

              <div className="grid grid-cols-2">
                <p className="text-gray-400 font-bold">
                  Transaction ID
                </p>

                <p className="font-bold text-[#2A245A] text-right break-all">
                  032kfi9ib1d02
                </p>
              </div>

              <div className="grid grid-cols-2">
                <p className="text-gray-400 font-bold">
                  Session ID
                </p>

                <p className="font-bold text-[#2A245A] text-right break-all">
                  100033250420095438717319261396
                </p>
              </div>

            </div>
          </div>

          <hr className="my-8 border-dashed" />

          <p className="text-gray-400 font-bold text-center text-lg">
            Enjoy Seamless and Unlimited Free Transfers to All Banks.
          </p>

        </div>

        {/* Receipt Dots Bottom */}
        <div className="flex justify-between px-3 pb-2 bg-white">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 bg-black rounded-full translate-y-3"
            />
          ))}
        </div>

      </div>
    </div>
  );
}