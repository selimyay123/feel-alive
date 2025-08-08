function Contact() {
    return (
        <div className="w-[40%] rounded-lg backdrop-blur-3xl max-md:w-full mx-auto px-4 py-6 space-y-4 flex flex-col justify-center items-center border border-white/15">
            <input required type="text" placeholder="Name*" className="border border-white px-4 py-3 rounded-lg w-full" />
            <input required type="text" placeholder="Last Name*" className="border border-white px-4 py-3 rounded-lg w-full" />
            <input required type="email" placeholder="Email*" className="border border-white px-4 py-3 rounded-lg w-full" />
            <textarea required name="content" id="content" placeholder="Write your message here...*" className="border w-full border-white px-4 py-3 rounded-lg min-h-[200px]">
            </textarea>
            <button className="w-full bg-white/80 text-black rounded-lg px-4 py-3 mt-2">Submit</button>
        </div>
    )
}

export default Contact