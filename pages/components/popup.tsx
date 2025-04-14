import React from 'react';
import Popup from 'reactjs-popup';
type Props = {
    question: string;
    options: string[];
    answer: string;
};

type State = {
    open: boolean;
    selectedOption: string;
}

export class QuestionPopup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { open: true, selectedOption: '' }
    }

    handleOptionChange(changeEvent: { target: { value: any; }; }) {
        this.setState({
          selectedOption: changeEvent.target.value,
        });
      }

    render() {
        return (
            <Popup open={this.state.open} modal>
                {((close) => (
                    <div>
                        <a onClick={close}>
                            &times;
                        </a>
                        <h1>{this.props.question}</h1>
                        <form>
                            {this.props.options.map((option: any) => (
                                <div className="radio" key={option}>
                                    <input
                                        type="radio"
                                        value={option}
                                        checked={this.state.selectedOption === option}
                                        onChange={this.handleOptionChange.bind(this)}/>
                                    <label>
                                        {option}
                                    </label>
                                </div>
                            ))}
                            {this.state.selectedOption !== '' && <>
                                {this.state.selectedOption === this.props.answer && <h2>Correct answer!</h2>}
                                {this.state.selectedOption !== this.props.answer && <h2>Incorrect: {this.props.answer}</h2>}
                                <button onClick={close}>Continue</button>
                            </>}
                        </form>
                    </div>
                ))()}
            </Popup>
        )
    }
}

// avoids Build optimization failed: found pages without a React Component as default export in 
export default function Ignore() {
  return <>{/* nothing */}</>;
}