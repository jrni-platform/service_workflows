## Service Workflow example

This example JRNI App is perfect for business who wish to groups Services in unusual ways in the platform.

The App works by creating a new custom object, called a Service Pool, that essentially contains a title and description.

Each Service Pool can then be assigned to one or more services, using a mapping object called a Pool Map. This allows you to create multiple shared extra descriptions about services, that you can then assign a service.

The App expands the Studio UI by adding two new pages:
* A Pool Editor page that shows you created service pools and lets and edit and delete existing ones
* A Pool Picker page, which is added to the services tabs that lets you pick the pools to be assigned to that service.

The properties of the Pools are then exposed via the Public API's and attached to the services via HAL, that allow you to build a front end public interface that reads these extra service properties

Feel free to add extra properties to the pools as you see fit, or to attach them to other core objects, such as Staff, Resources or Companies to allow you to further extend data sets
