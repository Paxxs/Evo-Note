# 计算vercel图标垂直翻转后的路径
# 原始点
points = [(24, 22.525), (0, 22.525), (12, 1.475)]

# 计算翻转后的点
flipped_points = [(24-x, 22.525-y) for x, y in points]

# 构造翻转后的路径
# 起始点变为翻转后的第一个点，H（水平线）变为翻转后的第二个点的x坐标，l（相对线）变为第三个点相对于第二个点的位置
flipped_path_d = f"M{flipped_points[0][0]} {flipped_points[0][1]}H{flipped_points[1][0]}l{flipped_points[2][0]-flipped_points[1][0]} {flipped_points[2][1]-flipped_points[1][1]}z"

flipped_path_d

# 更新翻转后的点以向下移动5个像素
moved_down_points = [(x, y+3) for x, y in flipped_points]

# 构造向下移动后的路径
moved_down_path_d = f"M{moved_down_points[0][0]} {moved_down_points[0][1]}H{moved_down_points[1][0]}l{moved_down_points[2][0]-moved_down_points[1][0]} {moved_down_points[2][1]-moved_down_points[1][1]}z"

print(moved_down_path_d)