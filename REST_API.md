# REST API 사용법

## 주문 API (**`pip install pandas` 선행!**)

| Request type  | Description |
|---------------|-------------|
| **`GET`**         | 주문 데이터 얻기(completed가 False 인 것만) |
| **`POST`**        | 주문 데이터 생성 |
| **`PATCH`**      | 조리 완료 설정 |
| **`DELETE`**     | 주문 데이터 삭제 -> 사용 X! |

---
### 사용 예제

#### GET
1. 특정 주문 데이터 조회 (completed가 False 인 것만) : 

```js
axios.get("/orders", {params:{pk:int}})
```


2. 전체 주문 데이터 조회 (completed가 False 인 것만) : 
```js
axios.get("/orders")
```


#### POST
- 주문 데이터 삽입 (totalPrice는 꼭 리액트에서 계산해서!)
    - 데이터 예시 
    ```json
{
   "menus":[
              {
                 "menuId":3,
                 "options":[1, 3],
                 "quantity":1
              },
              {
                 "menuId":1,
                 "options":[],
                 "quantity":2
              }
           ],
   "totalPrice":10000
}
    ```
- **API 콜**
```js
axios.post('/orders', {data:data})
```

#### PATCH
- 조리 완료 (completed = True)
    - **`orderPK(int)`는 필수로!**
    
```js
axios.patch('/orders', {pk:orderPk})
```

#### DELETE
- 주문 데이터 삭제 (일단 만들기 했지만, 사용 X)
```js
axios.delete('/orders', {params:{pk:orderPk}})
```



------------
## Status codes

The API is designed to return different status codes according to context and
action. This way, if a request results in an error, the caller is able to get
insight into what went wrong.

The following table gives an overview of how the API functions generally behave.

| Request type  | Description |
|---------------|-------------|
| `GET`         | Access one or more resources and return the result as JSON. |
| `POST`        | Return `201 Created` if the resource is successfully created and return the newly created resource as JSON. |
| `GET` / `PUT` | Return `200 OK` if the resource is accessed or modified successfully. The (modified) result is returned as JSON. |
| `DELETE`      | Returns `204 No Content` if the resource was deleted successfully. |

The following table shows the possible return codes for API requests.

| Return values            | Description |
|--------------------------|-------------|
| `200 OK`                 | The `GET`, `PUT` or `DELETE` request was successful, the resource(s) itself is returned as JSON. |
| `204 No Content`         | The server has successfully fulfilled the request and that there is no additional content to send in the response payload body. |
| `201 Created`            | The `POST` request was successful and the resource is returned as JSON. |
| `304 Not Modified`       | Indicates that the resource has not been modified since the last request. |
| `400 Bad Request`        | A required attribute of the API request is missing, e.g., the title of an issue is not given. |
| `401 Unauthorized`       | The user is not authenticated, a valid [user token](#authentication) is necessary. |
| `403 Forbidden`          | The request is not allowed. For example, the user is not allowed to delete a project. |
| `404 Not Found`          | A resource could not be accessed. For example, an ID for a resource could not be found. |
| `405 Method Not Allowed` | The request is not supported. |
| `409 Conflict`           | A conflicting resource already exists. For example, creating a project with a name that already exists. |
| `412`                    | Indicates the request was denied. May happen if the `If-Unmodified-Since` header is provided when trying to delete a resource, which was modified in between. |
| `422 Unprocessable`      | The entity could not be processed. |
| `429 Too Many Requests`  | The user exceeded the [application rate limits](../administration/instance_limits.md#rate-limits). |
| `500 Server Error`       | While handling the request, something went wrong server-side. |

