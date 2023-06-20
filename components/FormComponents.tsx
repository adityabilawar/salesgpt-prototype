export function heading(title, subtitle) {
  return (
    <div className="flex flex-col space-y-5">
      <h3 className="text-3xl leading-6 font-medium text-gray-900 mt-10">
        {title}
      </h3>
      <p className="mt-1 min-w-xl max-w-3xl text-[15px] text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}

export function textBox(
  question,
  type,
  id,
  placeholder,
  setValue,
  border = true,
  readOnly = false,
  value = ""
) {
  return (
    <div
      className={
        border
          ? "grid grid-cols-3 gap-4 items-start pt-5 border-t border-gray-200"
          : "grid grid-cols-3 gap-4 items-start pt-5"
      }
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mt-px pt-2"
      >
        {question}
      </label>
      <div className="mt-1 col-span-2">
        <div className="max-w-lg flex rounded-md shadow-sm">
          <input
            value={value} // Set this to value, not placeholder
            readOnly={readOnly}
            required
            onChange={e => {
              setValue(e.target.value);
            }}
            type={type}
            name={id}
            id={id}
            placeholder={placeholder} // Placeholders should go here
            className="flex-1 block max-w-3xl focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-none rounded-r-md text-sm border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}


export function dropDown(question, id, options, setValue) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start border-t border-gray-200 pt-5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mt-px pt-2"
      >
        {question}
      </label>
      <div className="mt-1 col-span-2">
        <select
          required
          onChange={e => {
            setValue(e.target.value);
          }}
          id={id}
          name={id}
          className="max-w-lg block focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm sm:max-w-xs text-sm border-gray-300 rounded-md"
        >
          {options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function textArea(question, id, setValue, rows = 3, border=false) {
  return (
    <div className={`sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start ${border ? 'sm:border-t sm:border-gray-200' : ''} sm:pt-5`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mt-px pt-2"
      >
        {question}
      </label>
      <div className="mt-1 col-span-2">
        <textarea
          required
          onChange={e => {
            setValue(e.target.value);
          }}
          id={id}
          name={id}
          rows={rows}
          className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 text-sm border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}

export function radioButtons(question, id, options, setValue) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start border-t border-gray-200 pt-5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mt-px pt-2"
      >
        {question}
      </label>
      <fieldset className="mt-4">
        <div className="space-y-1">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                required
                value={option.value1}
                onChange={e => {
                  setValue(e.target.value);
                }}
                id={option.id}
                name={id}
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label
                htmlFor={option.id}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {option.value1}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default function TextBoxWithIcon({
  text,
  type,
  placeholder,
  icon,
  setValue,
}) {
  return (
    <div className="h-10">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 ml-1"
      >
        {text}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          onChange={e => {
            setValue(e.target.value);
          }}
          type={type}
          name={text}
          id={text}
          className="focus:ring-brandf focus:border-brandt block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export function cancelButton() {
  return (
    <button
      type="reset"
      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Cancel
    </button>
  );
}

export function submitButton() {
  return (
    <button
      type="submit"
      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Submit
    </button>
  );
}

export const booleanOptions = [
  { id: "yes", value1: "Yes" },
  { id: "no", value1: "No" },
];

// export function phoneBox(question, setValue) {
//   let onKeyDown = undefined;
//   let onChange = e => {
//     setValue(e.target.value);
//   };

//   onKeyDown = e => {
//     const key = e.key;
//     const keyCode = e.keyCode || e.charCode;

//     // Allow backspace
//     if (keyCode === 8) {
//       return true;
//     }

//     // Check if the key pressed is a number
//     if (key.match(/[0-9]/)) {
//       let value = e.target.value.replace(/-/g, ""); // Remove any existing dashes
//       let formattedValue = "";

//       // Add the first dash after 3 digits
//       if (value.length > 3) {
//         formattedValue += value.substr(0, 3) + "-";
//         value = value.substr(3);
//       }

//       // Add the second dash after 6 digits
//       if (value.length > 3) {
//         formattedValue += value.substr(0, 3) + "-";
//         value = value.substr(3);
//       }

//       // Add any remaining digits
//       formattedValue += value;

//       e.target.value = formattedValue;
//       onChange(e);
//       return false;
//     }

//     // Disallow any other characters
//     e.preventDefault();
//     return false;
//   };

//   return (
//     <div className="grid grid-cols-3 gap-4 items-start border-t border-gray-200 pt-5">
//       <label
//         htmlFor={"phone_number"}
//         className="block text-sm font-medium text-gray-700 mt-px pt-2"
//       >
//         {question}
//       </label>
//       <div className="mt-1 col-span-2">
//         <div className="max-w-lg flex rounded-md shadow-sm">
//           <input
//             required
//             onChange={e => {
//               setValue(e.target.value);
//             }}
//             type={"tel"}
//             name={"phone_number"}
//             id={"phone_number"}
//             placeholder={"123-456-7890"}
//             className="flex-1 block max-w-3xl focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-none rounded-r-md text-sm border-gray-300"
//             pattern={"[0-9]{3}-[0-9]{3}-[0-9]{4}"}
//             onKeyDown={onKeyDown}
//             minLength={12}
//             maxLength={12}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
