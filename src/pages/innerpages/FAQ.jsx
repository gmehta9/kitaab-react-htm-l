import React, { useEffect } from "react";
import { Accordion, Container } from "react-bootstrap";

const faqs = [
    {
        id: 1,
        heading: 'Why KitaabJunction ?',
        content: 'Kitaab Junction team is committed to bring to you the best of the brilliant from the world of written text, at prices which are literally a steal. Sharing books with others offers numerous benefits, both for individuals and for society as a whole.'
    },
    {
        id: 2,
        heading: 'Why should I share my books with others ?',
        content: `
        <p>Following are few compelling reasons to share books with others:</p>
<ul>
    <li>Fostering a Love for Reading by igniting a passion for reading in others.</li>
    <li>Building Community and Connections by creating opportunities for discussions and connections between people. </li>
    <li>Promoting Knowledge and Understanding by exposing readers to different perspectives, cultures, and ideas. </li>
    <li>Environmental Benefits by promoting a more sustainable way of consuming literature.</li>
    <li>Economic Savings, especially beneficial for students and individuals with limited financial resources.</li>
</ul>
<p> Overall, sharing books enriches lives, builds communities, and contributes to a more informed and compassionate society. </p>
`
    },
    {
        id: 3,
        heading: 'What if the book delivered is not in good shape ?',
        content: `
        <p>We have liberal return policy since our primary goal is not to earn profit but earn respect of our stakeholders while expanding knowledge base of the community we live in.</p>
        <p>No charges if the book was delivered by us & the return request is submitted to us within 7 days of the delivery.</p>`
    },
    {
        id: 4,
        heading: 'What if I do not find book I am looking for ?',
        content: 'No problem, please add it in your Wishlist on our website and we will get back to you as soon as it lands in our inventory.'
    }
]

function FAQPage() {

    useEffect(() => {
        document.title = `FAQ's | Kitaab Juction`;
    }, []);
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