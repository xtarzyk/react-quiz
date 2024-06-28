/* eslint-disable react/prop-types */
export default function Options({ options }) {
  return (
    <div className="options">
      {options.map((option, index) => (
        <button className="btn btn-option" key={index}>
          {option}
        </button>))
      }
    </div>
  )
}
