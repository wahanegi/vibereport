import React, {Fragment, useState} from "react";
import {convertUsersToString} from "../../helpers/helpers";
import parse from "html-react-parser";
import polygon_shoutout from "../../../../assets/images/polygon-shoutout.svg";
import Collapse from "react-bootstrap/Collapse";
import {mentionToRichText} from "../CausesToCelebrate";

const ShoutoutItem = ({shoutout, prefix, users = []}) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const toggle = () => {
    setIsCollapse(!isCollapse);
  };

  return <div className='row wrap shoutout answer mb-1 w-auto'>
    <div className="col-9">
      <div className='h5 w-auto text-start truncated fw-semibold'>
        {prefix}
        {prefix && convertUsersToString(users)}
        {isCollapse && !prefix && parse(mentionToRichText(shoutout.rich_text))}
        {isCollapse && prefix && <Fragment>"{parse(mentionToRichText(shoutout.rich_text))}"</Fragment>}
      </div>
      {
        !isCollapse && !prefix && <div className='h5 text-start fw-semibold'>{parse(mentionToRichText(shoutout.rich_text))}</div>
      }
    </div>
    <div className="col-3">
      <div className='d-flex flex-nowrap justify-content-end align-items-center pointer' onClick={toggle}>
        <span className='me-1 mb-0 muted h6'>{isCollapse ? 'See more ' : 'See less '}</span>
        <img src={polygon_shoutout} alt="answer" className={isCollapse ? '' : 'rotate'} />
      </div>
    </div>
    {
      !isCollapse && prefix && <Collapse in={!isCollapse}>
        <div className='h5 text-start fw-semibold'>"{parse(mentionToRichText(shoutout.rich_text))}"</div>
      </Collapse>
    }
  </div>
}

export default ShoutoutItem
