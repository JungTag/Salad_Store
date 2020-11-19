import models
from flask_restful import Resource, Api, reqparse
from flask import Flask, request, jsonify, request
from database import session, Base, engine
from order import  query_to_dict


class Statistic(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('startDate', required=False, help = 'start date of filtering orders')
    parser.add_argument('endDate', required=False, help = 'end date of filtering orders')
    parser.add_argument('menu', type = bool, required=False, help = 'if you want to see menu stat, give any context on this. if not just set null')
    parser.add_argument('option', type = bool, required=False, help = 'if you want to see option stat, give any context on this. if not just set null')

    def get(self):
        data = Statistic.parser.parse_args()

        # 조회 날짜 설정
        start_date = data['startDate']
        end_date = data['endDate']
        
        # 전체 주문 데이터 통계
        stat_sql = f"""
                        SELECT
                        IF (GROUPING(DATE_FORMAT(order_time,  '%Y-%m-%d')) = 1, '총합', DATE_FORMAT(order_time,  '%Y-%m-%d')) AS '날짜', count(order_pk) AS '주문 건수',  CAST(SUM(total_price) AS signed integer) AS '매출'
                                FROM ORDERS ORD
                                WHERE completed = TRUE AND order_time BETWEEN DATE_FORMAT(\'{start_date}\',  '%Y-%m-%d') AND DATE_FORMAT(DATE_ADD(\'{end_date}\', INTERVAL 1 DAY), '%Y-%m-%d')
                                GROUP BY DATE_FORMAT(order_time,  '%Y-%m-%d') WITH ROLLUP;
                        """

        if data['menu']:
            # 메뉴 데이터 통계
            stat_sql = f"""
                            SELECT
                            IF(GROUPING(menu_name)=1, '총 합', menu_name) AS '메뉴', CAST(SUM(quantity) AS signed integer) AS '개수', menu_price * CAST(SUM(quantity) AS signed integer) AS '매출'
                                    FROM ORDERS ORD
                                    JOIN ORDER_PRODUCTS ORD_PRD USING(order_pk)
                                    JOIN MENUS M ON (M.menu_pk = ORD_PRD.order_menu_pk)
                                    JOIN ORDER_OPTIONS ORD_OP USING (product_pk)
                                    WHERE ORD.completed = TRUE AND ORD.order_time between DATE_FORMAT(\'{start_date}\',  '%Y-%m-%d') and DATE_FORMAT(DATE_ADD(\'{end_date}\', INTERVAL 1 DAY), '%Y-%m-%d')
                                    GROUP BY menu_name WITH ROLLUP;
                            """
            
        elif data['option']:
            # 옵션 데이터 통계
             stat_sql = f"""
                            SELECT
                            IF(GROUPING(option_name)=1, '총 합', option_name) AS '옵션', CAST(SUM(quantity) AS signed integer) AS '개수', option_price * CAST(SUM(quantity) AS signed integer) AS '매출'
                                    FROM ORDERS ORD
                                    JOIN ORDER_PRODUCTS ORD_PRD USING(order_pk)
                                    JOIN MENUS M ON (M.menu_pk = ORD_PRD.order_menu_pk)
                                    JOIN ORDER_OPTIONS ORD_OP USING (product_pk)
                                    JOIN OPTIONS USING (option_pk)
                                    WHERE ORD.completed = TRUE AND ORD.order_time between DATE_FORMAT(\'{start_date}\',  '%Y-%m-%d') and DATE_FORMAT(DATE_ADD(\'{end_date}\', INTERVAL 1 DAY), '%Y-%m-%d')
                                    GROUP BY option_name WITH ROLLUP;
                            """
        
        result = session.execute(stat_sql).fetchall()
        result = query_to_dict(result)
        return {'data' : result}, 200  
        
    def post(self):
        pass
    def put(self):
        pass
    def delete(self):
        pass
