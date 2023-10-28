interface ClickToViewProps {
    name: string
    offsety: number
}

const ClickToView: React.FC<ClickToViewProps> = ({ name, offsety }) => {
    return (
        <div className={"md:hidden block absolute  text-black left-4 bg-white opacity-50 px-2 py-1 rounded tracking-widest " + "top-" + offsety}>
            <span className="text-base">{name}</span>
        </div>
    )
}


export default ClickToView