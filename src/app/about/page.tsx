import Image from "next/image"

function About() {
    return (
        <div className="space-y-8">
            <h1 className="text-7xl mt-4">What is the vision?</h1>
            <div className="flex max-md:flex-col items-center gap-4">
                <Image src={"/hero.png"} alt={"hero"} width={300} height={300} className="rounded-lg max-md:w-full" />
                <div className="space-y-4 border border-white/15 backdrop-blur-lg rounded-lg p-4">
                    <p className="font-semibold text-xl">
                        Are you tired of doing the same things every day?
                    </p>
                    <p className="text-xl">
                        Wake up → Go to school or work → Come back home → Eat → Sleep.
                        Most of us are living on autopilot. That is why time feels like it is slipping away.
                    </p>
                    <p className="text-xl">
                        That is why I created FeelAlive — a simple way to break free from the routine.
                        Just tap a button, and you will get a random task.
                    </p>
                    <p className="text-xl">
                        Do not worry — these tasks are not meant to drain your time or energy.
                        They are designed to help you pause for a moment… and remember:
                    </p>
                    <p className="text-xl">
                        You are not a robot.
                    </p>
                    <p className="text-xl">
                        You are alive.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default About