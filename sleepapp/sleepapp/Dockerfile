# Base image
FROM python:3.10.7

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the working directory
COPY requirements.txt /code/

# Install project dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project code to the working directory
COPY . /code/

# Run migrations
# RUN python sleepapp/manage.py migrate

# Expose port 8000 for the Django development server
EXPOSE 8000

# Start the Django development server
CMD ["python", "sleepapp", "manage.py", "runserver", "0.0.0.0:8000"]
