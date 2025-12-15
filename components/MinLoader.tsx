import { Hatch } from 'ldrs/react'
import 'ldrs/react/Hatch.css'

const MinLoader = () => {
    return (
        <div>
            <div className='dark:hidden'>
                <Hatch
                    size="28"
                    stroke="4"
                    speed="3.5"
                    color="black"
                />
            </div>
            <div className='hidden dark:block'>
                <Hatch
                    size="28"
                    stroke="4"
                    speed="3.5"
                    color="white"
                />
            </div>
        </div>

    )
}

export default MinLoader