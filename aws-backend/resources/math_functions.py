import math

class MathematicalGenius:
    # given two points
    def pythagoris(p1, p2):
        x_length = abs(p1[0] - p2[0])
        y_length = abs(p1[1] - p2[1])
        x_squared = x_length**2
        y_squared = y_length**2
        c_squared = x_squared + y_squared
        res = math.sqrt(c_squared)
        return res
    
    
    def find_line_between_two_points(p1, p2):
        a = p2[1] - p1[1]
        b = p1[0] - p2[0]
        c = (a*(p1[0]) + b*(p1[1]))*-1
        return a,b,c

    # finds perpendicular distance for a point to a line
    def perpendicular_distance(a, b, c, p1):
        res = abs((a * p1[0] + b * p1[1] + c)) / (math.sqrt(a * a + b * b))
        return res

    def find_normal_to_line_at_point(a, b, c, p1):
        if b == 0:  # Handling the case of a vertical line
            a_normal = 0
            b_normal = 1
        else:
            a_normal = b
            b_normal = -a

        c_normal = -(a_normal * p1[0] + b_normal * p1[1])
        
        return a_normal, b_normal, c_normal
    
    def signed_distance_to_line(a, b, c, p1):
        return (a * p1[0] + b * p1[1] + c) / math.sqrt(a ** 2 + b ** 2)

    def is_point_between_lines(a1, b1, c1, a2, b2, c2, p1):
        distance1 = MathematicalGenius.signed_distance_to_line(a1, b1, c1, p1)
        distance2 = MathematicalGenius.signed_distance_to_line(a2, b2, c2, p1)
        
        return (distance1 < 0 and distance2 > 0) or (distance1 > 0 and distance2 < 0)