import React from "react";
import { Accordion, Container } from "react-bootstrap";

const faqs = [
    {
        id: 1,
        heading: 'Why KitaabJunction ?',
        content: 'Kitaab Junction team is committed to bring to you the best of the brilliant from the world of written text, at prices which are literally a steal.'
    },
    {
        id: 2,
        heading: 'How the quality of books delivered is ensured?',
        content: 'If you opt for KitaabJunction delivery, then be assured all the deliveries are passed with rigor and quality checks before it is dispatched to you. This ensure that the book is in good condition before it is delivered at your location. '
    },
    {
        id: 3,
        heading: 'What if the book delivered is not in good shape ',
        content: 'We have liberal return policy since our primary goal is not to earn profit but earn respect of our stakeholders while expanding knowledge base of the community we live in.<br/> <br/>No charges if book return request submitted to us within 7 days of delivery.'
    },
    {
        id: 4,
        heading: 'What if I do not find book I am looking for?',
        content: 'No problem, please add it in your Wishlist on our website and we will get back to you as soon as it lands in our inventory.'
    }
]

function FAQPage() {

    return (
        <Container>
            <div className="mt-5">
                <h3 className="font-weight-bold">FAQ's</h3>
                <Accordion defaultActiveKey="1">
                    {faqs.map(item =>
                        <React.Fragment>

                            <Accordion.Item className eventKey={item.id.toString()}>
                                <Accordion.Header className="w-100">{item.heading}</Accordion.Header>
                                <Accordion.Body>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                </Accordion.Body>
                            </Accordion.Item>

                        </React.Fragment>
                    )}
                </Accordion>
            </div>
        </Container>
    )
}

export default FAQPage;