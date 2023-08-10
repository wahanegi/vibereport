import React, {Fragment} from "react";
import {convertUsersToString} from "../../helpers/helpers";
import parse from "html-react-parser";
import {mentionToRichText} from "../CausesToCelebrate";

const ShoutoutItem = ({shoutout, prefix, users = []}) => {

  return <div className='row wrap shoutout answer mb-1 w-auto'>
    <div className="col-xl-12">
      <div className='h5 w-auto text-start truncated fw-semibold'>
        {prefix}
        {prefix && convertUsersToString(users)}
        {!prefix && parse(mentionToRichText(shoutout.rich_text))}
        {prefix && <Fragment>"{parse(mentionToRichText(shoutout.rich_text))}"</Fragment>}
      </div>
    </div>
  </div>
}

export default ShoutoutItem
