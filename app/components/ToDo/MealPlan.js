import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

const MealPlan = props => {
    const [meals, setMeals] = useState([])

    useEffect(() => {
        async function getBulk(ids) {
            let params = { ids: ids }
            const res = await repo.SpoonacularService.getInformationBulk(params);
            setMeals(res.data);
        }
        const fetchData = async function fetchData() {
            const res = await repo.SpoonacularService.getMealPlan();
            let idArray = []
            res.data.items.map(list => {
                let value = JSON.parse(list.value);
                idArray.push(value.id)
            })
            getBulk(idArray.toString());
        }
        fetchData();
    }, []);

    const mapMeals = () => {
        return (
            <div className="row">
                {meals.map((item, index) => {
                    return (
                        <div className="col-lg-4" key={index}>
                            <Card>
                                <Card.Img variant="top" src={item.image} />
                                <Card.Body>
                                    <Card.Title>Day {index % 3 + 1}</Card.Title>
                                    <Card.Text>
                                        {item.title}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">View</small>
                                </Card.Footer>
                            </Card>
                        </div>
                    );
                })}
            </div>
        )
    }

    return (mapMeals());
}

export default MealPlan;
