import React from 'react'

const Agenotice = () => {
    return (
        <div className="mt-5 rounded-2xl border border-brand-700 bg-brand-800 px-4 pb-4 pt-5 shadow-sm">
            <div className="flex justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-red-500 text-sm font-extrabold text-white">
                    +18
                </span>
            </div>

            <ul className="mt-3 space-y-1.5 text-[11px] leading-snug text-mint-300">
                <li className="flex gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                    <span>
                        The BRAND platform advocates fairness, justice, and openness. We
                        mainly operate fair lottery, blockchain games, live casinos, and
                        slot machine games.
                    </span>
                </li>
                <li className="flex gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                    <span>
                        BRAND works with more than 10,000 online live game dealers and
                        slot games, all of which are verified fair games.
                    </span>
                </li>
                <li className="flex gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                    <span>
                        BRAND supports fast deposit and withdrawal, and looks forward to
                        your visit.
                    </span>
                </li>
            </ul>

            <p className="mt-2 pl-3 text-[11px] leading-snug text-gold-400">
                Gambling can be addictive, please play rationally.
                <br />
                BRAND only accepts customers above the age of 18.
            </p>
        </div>

    )
}

export default Agenotice